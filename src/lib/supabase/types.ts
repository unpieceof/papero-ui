export type UserType = 'a' | 'b'
export type RecType = 'classic' | 'trending'
export type BookmarkSource = 'paper' | 'recommendation'

export interface Profile {
  id: string
  email: string
  nickname: string
  user_type: UserType
  point_color: string
  stamp_icon: string
  created_at: string
  updated_at: string
}

export interface Paper {
  id: string
  author_id: string
  title: string
  paper_url: string | null
  hook: string
  content: string
  tags: string[]
  created_at: string
  updated_at: string
  // joined fields
  author?: Profile
  stamps?: Stamp[]
}

export interface Stamp {
  id: string
  paper_id: string
  user_id: string
  created_at: string
  // joined
  user?: Profile
}

export interface Recommendation {
  id: string
  title: string
  authors: string[]
  year: number | null
  arxiv_url: string | null
  pdf_url: string | null
  category: string | null
  tags: string[]
  rec_type: RecType
  summary_ko: string
  why_read: string
  difficulty: number
  difficulty_label: string
  read_time_min: number | null
  display_order: number
  source: string | null
  score: number | null
  reading_order_tip: string | null
  fetched_date: string
  created_at: string
}

export interface Bookmark {
  id: string
  paper_id: string | null
  recommendation_id: string | null
  user_id: string
  source: BookmarkSource
  created_at: string
  // joined
  paper?: Paper
  recommendation?: Recommendation
}

export interface Comment {
  id: string
  paper_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  // joined
  user?: Profile
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      papers: {
        Row: Paper
        Insert: Omit<Paper, 'id' | 'created_at' | 'updated_at' | 'author' | 'stamps'>
        Update: Partial<Omit<Paper, 'id' | 'created_at' | 'author' | 'stamps'>>
      }
      stamps: {
        Row: Stamp
        Insert: Omit<Stamp, 'id' | 'created_at' | 'user'>
        Update: never
      }
      recommendations: {
        Row: Recommendation
        Insert: Omit<Recommendation, 'id' | 'created_at'>
        Update: Partial<Omit<Recommendation, 'id' | 'created_at'>>
      }
      bookmarks: {
        Row: Bookmark
        Insert: Omit<Bookmark, 'id' | 'created_at' | 'paper' | 'recommendation'>
        Update: never
      }
      comments: {
        Row: Comment
        Insert: Omit<Comment, 'id' | 'created_at' | 'updated_at' | 'user'>
        Update: Partial<Omit<Comment, 'id' | 'created_at' | 'user'>>
      }
    }
  }
}
