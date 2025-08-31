<?php
namespace Tests;

use Laravel\Lumen\Testing\DatabaseMigrations;

class PostTest extends TestCase
{
    use DatabaseMigrations;

    protected $token;

    protected function setUp(): void
    {
        parent::setUp();

        // Create user + login
        $this->post('/api/register', [
            'name' => 'Poster',
            'email' => 'poster@example.com',
            'password' => 'password'
        ]);

        $login = $this->post('/api/login', [
            'email' => 'poster@example.com',
            'password' => 'password'
        ]);

        $this->assertEquals(
            200,
            $login->response->getStatusCode(),
            "Login failed in PostTest setup: " . $login->response->getContent()
        );

        $body = json_decode($login->response->getContent(), true);
        $this->assertArrayHasKey('token', $body);

        $this->token = $body['token'];
    }

    public function testUserCanCreatePost()
    {
        $response = $this->post('/api/posts', [
            'title' => 'My Post',
            'content' => 'This is the content'
        ], ['Authorization' => "Bearer {$this->token}"]);

        $response->seeStatusCode(201);
        $response->seeJsonStructure(['id', 'title', 'content', 'user_id']);
    }

    public function testUserCanFetchPosts()
    {
        $response = $this->get('/api/posts', ['Authorization' => "Bearer {$this->token}"]);
        $response->seeStatusCode(200);
    }
}
