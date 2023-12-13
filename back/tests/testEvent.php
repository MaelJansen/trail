<?php

namespace Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class testEvent extends WebTestCase
{
    public function testEvent()
    {
        $client = static::createClient();
        $client->request('GET', '/api/events');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testEventId()
    {
        $client = static::createClient();
        $client->request('GET', '/api/events/1');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }

    public function testEventIdNotFound()
    {
        $client = static::createClient();
        $client->request('GET', '/api/events/1000');
        $this->assertEquals(404, $client->getResponse()->getStatusCode());
    }
}