export interface Banner {
  banner_name: string
  banner_image: string
  description: string
}

export interface BannerResponse {
  status: number
  message: string
  data: Banner[]
}
