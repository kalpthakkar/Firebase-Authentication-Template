import React from 'react'
import { Link } from 'react-router-dom'

export default function Root() {

    return (
        <div>
            <h2>Root Page | Landing Page </h2>

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
