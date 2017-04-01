# albums
**GET: albums/**
- if not admin >> fetch all public ALBUMs of all users
- if admin >> fetch all mix ALBUMs of all users

**GET: users/:id/albums/**
- not owner >> fetch all public ALBUMs by :user_id
- if owner >> fetch all mix ALBUMs by :user_id

**GET: tags/:id/albums**
- fetch all public ALBUMs of all users by :tag_id

# posts
**GET: posts/**
- if not admin >> fetch all public POSTs of all users
- if admin >> fetch all mix POSTs of all users

**GET: users/:id/posts/**
- not owner >> fetch all public POSTs by :user_id
- if owner >> fetch all mix POSTs by :user_id

**GET: tags/:id/posts**
- fetch all public POSTs of all users by :tag_id
