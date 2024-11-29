import {describe, it, expect, afterEach} from 'bun:test'
import app from '../src'
import { logger } from '../src/application/logging'
import { userTest } from './test-util'

describe('POST /api/users', () => {
    afterEach(async () => {
        await userTest.delete()
    })

    it('should reject register new user if request is invalid', async () => {
        const response = await app.request('/api/users', {
            method: 'POST',
            body: JSON.stringify({
                username: "",
                password: "",
                name: ""
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(400)
        expect(body.errors).toBeDefined()
    })

    it('should reject register new user if username is already taken', async () => {
        await userTest.create()

        const response = await app.request('/api/users', {
            method: 'POST',
            body: JSON.stringify({
                username: "testuser",
                password: "testpassword123",
                name: "Test User"
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(400)
        expect(body.errors).toBeDefined()
    })

    it ('should register new user success', async () => {
        const response = await app.request('/api/users', {
            method: 'POST',
            body: JSON.stringify({
                username: "testuser",
                password: "testpassword123",
                name: "Test User"
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(200)
        expect(body.data).toBeDefined()

        expect(body.data.username).toBe("testuser")
        expect(body.data.name).toBe("Test User")
    })
})