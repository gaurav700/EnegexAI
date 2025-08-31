<?php
namespace Tests;

use Laravel\Lumen\Testing\DatabaseMigrations;

class AuthTest extends TestCase
{
    use DatabaseMigrations;

    public function testUserCanRegister()
    {
        $response = $this->post('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password'
        ]);

        $response->seeStatusCode(201);
        $response->seeJsonStructure(['id', 'name', 'email']);
    }

    public function testUserCanLoginAndGetToken()
    {
        // First register
        $this->post('/api/register', [
            'name' => 'Login User',
            'email' => 'login@example.com',
            'password' => 'password'
        ]);

        // Then login
        $response = $this->post('/api/login', [
            'email' => 'login@example.com',
            'password' => 'password'
        ]);

        // Make sure login succeeded
        $this->assertEquals(
            200,
            $response->response->getStatusCode(),
            "Login failed: " . $response->response->getContent()
        );

        $body = json_decode($response->response->getContent(), true);
        $this->assertArrayHasKey('token', $body);
    }
}
