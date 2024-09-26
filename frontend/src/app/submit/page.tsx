'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Camera, MapPin } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  type: z.string().min(1, { message: "Apparel type is required" }),
  condition: z.string().min(1, { message: "Condition is required" }),
  size: z.string().min(1, { message: "Size is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
})

type FormData = z.infer<typeof schema>

export default function Submit() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          toast.error('Unable to retrieve your location')
        }
      )
    } else {
      toast.error('Geolocation is not supported by your browser')
    }
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => formData.append(key, value))
      if (image) {
        formData.append('image', image)
      }
      if (location) {
        formData.append('latitude', location.lat.toString())
        formData.append('longitude', location.lng.toString())
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/apparel`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      toast.success('Apparel submitted successfully')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Error submitting apparel')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Submit Apparel for Recycling</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Apparel Type
          </label>
          <input
            type="text"
            id="type"
            {...register('type')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
        </div>
        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Condition
          </label>
          <select
            id="condition"
            {...register('condition')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Select condition</option>
            <option value="new">New</option>
            <option value="like_new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
          {errors.condition && <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>}
        </div>
        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Size
          </label>
          <input
            type="text"
            id="size"
            {...register('size')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.size && <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>}
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
          ></textarea>
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Image
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
            />
            <label
              htmlFor="image"
              className="cursor-pointer bg-white dark:bg-gray-800 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Camera className="w-5 h-5 inline-block mr-2" />
              Choose Image
            </label>
            {preview && (
              <img src={preview} alt="Preview" className="ml-4 h-20 w-20 object-cover rounded-md" />
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Location
          </label>
          <div className="mt-1 flex items-center">
            <MapPin className="w-5 h-5 text-gray-400" />
            <span className="ml-2">
              {location
                ? `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`
                : 'Retrieving location...'}
            </span>
          </div>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Submit for Recycling
        </button>
      </form>
    </div>
  )
}