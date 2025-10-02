const http = require('http');
const fs = require('fs');
const path = require('path');

// Mock data based on the database.sql file
const mockBlogs = [
  {
    id: 1,
    title: 'Building Your Personal Library: A Complete Guide',
    slug: 'building-personal-library-complete-guide',
    content: '<h2>Introduction</h2><p>Building a personal library is more than just collecting books...</p>',
    excerpt: 'Essential tips for curating a collection that reflects your personality and interests',
    featured_image: 'http://localhost:8000/uploads/1758779936_a-book-1760998_1280.jpg',
    featured_image_2: null,
    category_id: 1,
    category_name: 'Fiction',
    category_slug: 'fiction',
    tags: ['library', 'books', 'reading', 'collection', 'personal development'],
    meta_title: '',
    meta_description: '',
    is_featured: true,
    status: 'published',
    view_count: 0,
    created_at: '2024-01-01 00:00:00',
    updated_at: '2024-01-01 00:00:00',
    category: {
      id: 1,
      name: 'Fiction',
      slug: 'fiction'
    }
  },
  {
    id: 2,
    title: 'The Evolution of Fantasy Literature',
    slug: 'evolution-fantasy-literature',
    content: '<h2>From Tolkien to Modern Fantasy</h2><p>Fantasy literature has undergone tremendous evolution...</p>',
    excerpt: 'Exploring how fantasy literature has transformed over the decades',
    featured_image: 'http://localhost:8000/uploads/1758801057_a-book-759873_640.jpg',
    featured_image_2: null,
    category_id: 1,
    category_name: 'Fiction',
    category_slug: 'fiction',
    tags: ['fantasy', 'literature', 'evolution', 'tolkien', 'world-building'],
    meta_title: '',
    meta_description: '',
    is_featured: true,
    status: 'published',
    view_count: 0,
    created_at: '2024-01-02 00:00:00',
    updated_at: '2024-01-02 00:00:00',
    category: {
      id: 1,
      name: 'Fiction',
      slug: 'fiction'
    }
  }
];

const mockRelatedBooks = [
  {
    id: 1,
    blog_id: 1,
    title: 'The Library Book',
    author: 'Susan Orlean',
    purchase_link: 'https://www.amazon.com/Library-Book-Susan-Orlean/dp/1476740186',
    cover_image: null,
    description: 'A fascinating exploration of libraries and their cultural significance',
    price: '$15.99'
  },
  {
    id: 2,
    blog_id: 1,
    title: 'The Name of the Rose',
    author: 'Umberto Eco',
    purchase_link: 'https://www.amazon.com/Name-Rose-Umberto-Eco/dp/0544176561',
    cover_image: null,
    description: 'A medieval mystery set in a monastery library',
    price: '$16.99'
  },
  {
    id: 3,
    blog_id: 2,
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    purchase_link: 'https://www.amazon.com/Lord-Rings-J-R-R-Tolkien/dp/0544003411',
    cover_image: null,
    description: 'The foundational work of modern fantasy literature',
    price: '$22.99'
  }
];

function addRelatedBooksToBlogs(blogs) {
  return blogs.map(blog => {
    const relatedBooks = mockRelatedBooks
      .filter(book => book.blog_id === blog.id)
      .map(book => ({
        id: book.id,
        blog_id: book.blog_id,
        title: book.title,
        author: book.author,
        purchase_link: book.purchase_link,
        cover_image: book.cover_image,
        description: book.description,
        price: book.price
      }));
    
    return {
      ...blog,
      related_books: relatedBooks
    };
  });
}

const server = http.createServer((req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  console.log(`${req.method} ${pathname}`);

  // Handle different API endpoints
  if (pathname === '/api/blogs' || pathname === '/getBlogs.php') {
    const blogsWithRelatedBooks = addRelatedBooksToBlogs(mockBlogs);
    res.writeHead(200);
    res.end(JSON.stringify({
      blogs: blogsWithRelatedBooks,
      total: blogsWithRelatedBooks.length,
      page: 1,
      limit: blogsWithRelatedBooks.length,
      total_pages: 1
    }));
  } else if (pathname.match(/^\/api\/blogs\/(\d+)$/)) {
    const blogId = parseInt(pathname.split('/')[3]);
    const blog = mockBlogs.find(b => b.id === blogId);
    if (blog) {
      const blogWithRelatedBooks = addRelatedBooksToBlogs([blog])[0];
      res.writeHead(200);
      res.end(JSON.stringify({ blog: blogWithRelatedBooks }));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Blog not found' }));
    }
  } else if (pathname.match(/^\/api\/blogs\/slug\/(.+)$/)) {
    const slug = pathname.split('/')[4];
    const blog = mockBlogs.find(b => b.slug === slug);
    if (blog) {
      const blogWithRelatedBooks = addRelatedBooksToBlogs([blog])[0];
      res.writeHead(200);
      res.end(JSON.stringify({ blog: blogWithRelatedBooks }));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Blog not found' }));
    }
  } else if (pathname === '/api/categories' || pathname === '/getCategories.php') {
    res.writeHead(200);
    res.end(JSON.stringify([
      { id: 1, name: 'Fiction', slug: 'fiction', count: 2 },
      { id: 2, name: 'History', slug: 'history', count: 1 },
      { id: 5, name: 'Science', slug: 'science', count: 1 }
    ]));
  } else if (pathname === '/api/banner' || pathname === '/getBanner.php') {
    res.writeHead(200);
    res.end(JSON.stringify({
      banners: [
        {
          id: 1,
          title: 'Building Your Personal Library',
          subtitle: 'Essential tips for curating a collection that reflects your personality',
          image_url: 'http://localhost:8000/uploads/1758779936_a-book-1760998_1280.jpg',
          link_url: '/blog/building-personal-library-complete-guide'
        }
      ]
    }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  }
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Test backend server running at http://localhost:${PORT}`);
  console.log('API endpoints available:');
  console.log('  - GET /api/blogs - List all blogs with related books');
  console.log('  - GET /api/blogs/{id} - Get blog by ID with related books');
  console.log('  - GET /api/blogs/slug/{slug} - Get blog by slug with related books');
  console.log('  - GET /api/categories - List categories');
  console.log('  - GET /api/banner - Get banner data');
  console.log('');
  console.log('Related books should now be included in all blog responses!');
});