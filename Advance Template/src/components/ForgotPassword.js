import React, {useRef, useState} from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {

    const emailRef = useRef()
    const { requestNewPassword } = useAuth()
    const [ error, setError ] = useState('')
    const [ message, setMessage ] = useState('')
    const [ loading, setLoading ] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setMessage('')
            setError('')
            setLoading(true)
            await requestNewPassword(emailRef.current.value)
            setMessage('Check your inbox for further instructions')
        } catch {
            setError('Failed to reset password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div><h2>Reset Password</h2></div>
            <div>
                {message && <p>Message: {message}</p>}
                {error && <p>Error: {error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" ref={emailRef} placeholder='Enter your email' required></input>
                    <br/>
                    <input type="submit" disabled={loading}></input>
                </form>
            </div>

            <br/>

            <div>
                <p>
                    Want to sign in?
                    <Link to='/login'>Login</Link>
                </p>
            </div>

            <div>
                <p>
                    Create a new account? 
                    <Link to='/signup'>SignUp</Link> 
                </p>
            </div>
        </div>
    )
}
