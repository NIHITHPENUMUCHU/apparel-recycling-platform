'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Search, Filter, Share2 } from 'lucide-react'
import QRCode from 'qrcode.react'
import dynamic from 'next/dynamic'

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

interface Apparel {
  _id: string
  type: string
  condition: string
  size: string
  description: string
  imageUrl: string
  createdAt: string
  location: {
    coordinates: [number, number]
  }
}

export default function Dashboard() {
  const [apparel, setApparel] = useState<Apparel[]>([])
  const [filteredApparel, setFilteredApparel] = useState<Apparel[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCondition, setFilterCondition] = useState('')
  const [showQR, setShowQR] = useState<string | null>(null)
  const [showMap, setShowMap] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchApparel = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/apparel`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setApparel(response.data)
        setFilteredApparel(response.data)
      } catch (error) {
        toast.error('Error fetching apparel')
      }
    }
    fetchApparel()
  }, [router])

  useEffect(() => {
    const filtered = apparel.filter(
      (item) =>
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterCondition === '' || item.condition === filterCondition)
    )
    setFilteredApparel(filtered)
  }, [searchTerm, filterCondition, apparel])

  const handleShare = (id: string) => {
    const url = `${window.location.origin}/apparel/${id}`
    if (navigator.share) {
      navigator.share({
        title: 'Check out this recycled apparel',
        text: 'I just recycled this item on the Apparel Recycling Platform!',
        url: url,
      })
    } else {
      window.open(`https://twitter.com/intent/tweet?text=I just recycled this item on the Apparel Recycling Platform!&url=${url}`, '_blank')
    }
  }

  const mapCenter: [number, number] = [0, 0]
  const zoom = 2

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Your Recycled Apparel</h1>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
          <input
            type="text"
            placeholder="Search apparel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="relative w-full sm:w-48">
          <select
            value={filterCondition}
            onChange={(e) => setFilterCondition(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none"
          >
            <option value="">All Conditions</option>
            <option value="new">New</option>
            <option value="like_new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
          <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      <button
        onClick={() => setShowMap(!showMap)}
        className="mb-4 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
      >
        {showMap ? 'Hide Map' : 'Show Map'}
      </button>
      {showMap && (
        <div style={{ height: '400px', width: '100%' }}>
          <MapContainer center={mapCenter} zoom={zoom} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredApparel.map((item) => (
              <Marker
                key={item._id}
                position={[item.location.coordinates[1], item.location.coordinates[0]]}
              >
                <Popup>{item.type}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApparel.map((item) => (
          <div key={item._id} className="border rounded-lg overflow-hidden shadow-md dark:bg-gray-800">
            <img src={item.imageUrl} alt={item.type} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{item.type}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                <strong>Condition:</strong> {item.condition}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                <strong>Size:</strong> {item.size}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{item.description}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                Submitted on {new Date(item.createdAt).toLocaleDateString()}
              </p>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setShowQR(item._id)}
                  className="bg-secondary hover:bg-secondary-dark text-white px-3 py-1 rounded"
                >
                  QR Code
                </button>
                <button
                  onClick={() => handleShare(item._id)}
                  className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded flex items-center"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <QRCode value={`${window.location.origin}/apparel/${showQR}`} />
            <button
              onClick={() => setShowQR(null)}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}