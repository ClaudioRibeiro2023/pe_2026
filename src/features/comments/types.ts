export interface Comment {
  id: string
  content: string
  action_plan_id: string
  user_id: string
  created_at: string
  updated_at: string
  user_email?: string
  user_role?: string
}

export interface CreateCommentData {
  content: string
  action_plan_id: string
}

export interface UpdateCommentData {
  content: string
}
