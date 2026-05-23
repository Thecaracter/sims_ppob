import { memo } from 'react'

interface ProfileGreetingProps {
  userName: string
  profileImage: string
  greeting?: string
  defaultImage: string
}

const ProfileGreetingComponent = ({ 
  userName, 
  profileImage, 
  greeting = 'Selamat datang,',
  defaultImage 
}: ProfileGreetingProps) => {
  return (
    <div className="profile-greeting">
      <div className="profile-avatar">
        <img 
          src={profileImage || defaultImage}
          alt={userName}
          className="profile-avatar-img"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage
          }}
        />
      </div>
      <div className="profile-info">
        <p className="profile-label">{greeting}</p>
        <h1 className="profile-name">{userName}</h1>
      </div>
    </div>
  )
}

export const ProfileGreeting = memo(ProfileGreetingComponent)
