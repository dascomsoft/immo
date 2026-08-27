import cloudinary from '../config/cloudinary'
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary'

interface UploadResult {
  url: string
  publicId: string
}

class CloudinaryService {
  /**
   * Upload d'une image
   */
  async uploadImage(
    fileBuffer: Buffer,
    folder: string = 'real-estate',
    options?: any
  ): Promise<UploadResult> {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            ...options,
          },
          (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
            if (error) {
              reject(error)
            } else if (result) {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
              })
            } else {
              reject(new Error('Upload failed'))
            }
          }
        )
        uploadStream.end(fileBuffer)
      })
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      throw error
    }
  }

  /**
   * Upload multiple d'images
   */
  async uploadMultipleImages(
    files: Buffer[],
    folder: string = 'real-estate'
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map((file) =>
      this.uploadImage(file, folder, {
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
      })
    )
    return Promise.all(uploadPromises)
  }

  /**
   * Suppression d'une image
   */
  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId)
    } catch (error) {
      console.error('Cloudinary delete error:', error)
      throw error
    }
  }

  /**
   * Suppression multiple d'images
   */
  async deleteMultipleImages(publicIds: string[]): Promise<void> {
    try {
      const deletePromises = publicIds.map((id) => this.deleteImage(id))
      await Promise.all(deletePromises)
    } catch (error) {
      console.error('Cloudinary delete multiple error:', error)
      throw error
    }
  }

  /**
   * Générer l'URL d'une image avec transformations
   */
  getOptimizedUrl(publicId: string, options?: any): string {
    return cloudinary.url(publicId, {
      quality: 'auto:good',
      fetch_format: 'auto',
      ...options,
    })
  }

  /**
   * Générer une URL responsive
   */
  getResponsiveUrl(publicId: string, width: number = 800): string {
    return cloudinary.url(publicId, {
      width,
      height: Math.round(width * 0.75),
      crop: 'fill',
      quality: 'auto:good',
      fetch_format: 'auto',
    })
  }
}

export default new CloudinaryService()