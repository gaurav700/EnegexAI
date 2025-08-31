<?php
namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class PostController extends Controller
{
    // Fetch all posts
    public function index()
    {
        $posts = Redis::get('posts');

        if (!$posts) {
            $posts = Post::all();
            Redis::setex('posts', 600, $posts->toJson()); // cache JSON
        } else {
            $posts = json_decode($posts); // decode JSON string
        }

        return response()->json($posts);
    }

    // Create a new post
    public function store(Request $request)
    {
        $post = Post::create([
            'title'   => $request->title,
            'content' => $request->content,
            'user_id' => auth()->id(),
        ]);

        // Invalidate cached list + specific post
        Redis::del('posts');
        Redis::del("post_{$post->id}");

        return response()->json($post, 201);
    }

    // Fetch single post
    public function show($id)
    {
        $cacheKey = "post_$id";
        $post = Redis::get($cacheKey);

        if (!$post) {
            $post = Post::findOrFail($id);
            Redis::setex($cacheKey, 600, $post->toJson()); // cache JSON
        } else {
            $post = json_decode($post);
        }

        return response()->json($post);
    }
}
