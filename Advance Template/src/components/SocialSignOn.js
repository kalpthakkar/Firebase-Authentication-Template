import React, { useState} from 'react'
import { auth, googleAuthProvider, githubAuthProvider, facebookAuthProvider } from '../firebase'

export default function SocialSignOn() {

    const [ is3rdPartyCookieEnabled, set3rdPartyCookieResult ] = useState(true)

    // Google auth
    function handleGoogleLogging() {
        if(is3rdPartyCookieEnabled) 
        {
            auth.signInWithRedirect(new googleAuthProvider());
        } 
        else 
        {
            requestEnableCookies('Google')
        }
    }

    // Github auth
    /*
        Settings: https://github.com/settings/developers
    */
    function handleGithubLogging() {
        if(is3rdPartyCookieEnabled) 
        {
            auth.signInWithRedirect(new githubAuthProvider());
        } 
        else 
        {
            requestEnableCookies('Github')
        }
    }

    // Facebook auth
    /*
        Portal: https://developers.facebook.com/
        Doc: https://developers.facebook.com/docs/facebook-login/web
        Settings: https://developers.facebook.com/apps/YOUR_REACT_APP_FACEBOOK_APP_ID/settings/basic/
        OAuth Config: https://developers.facebook.com/apps/YOUR_REACT_APP_FACEBOOK_APP_ID/fb-login/settings/
        Permissions: https://developers.facebook.com/apps/YOUR_REACT_APP_FACEBOOK_APP_ID/app-review/permissions/
    */

    // ESLint doesn't know that the variable FB is a global. To fix this:
    // We declare FB as global by adding (global FB <- below line) on top.

    /*global FB*/
    window.fbAsyncInit = function() {
        FB.init({
          appId      : process.env.REACT_APP_FACEBOOK_APP_ID,
          cookie     : true,
          xfbml      : true,
          version    : 'v11.0'
        });
    
        FB.AppEvents.logPageView();   
          
        // FB.getLoginStatus(function(response) {
        //     this.statusChangeCallback(response);
        // });
    
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));  
        
        // document.trigger('fbload');
        var event = new CustomEvent("fbload");
        document.dispatchEvent(event);
    }

    /* fbload gets triggered after FB initialization has been completed */
    document.addEventListener(
        'fbload',
        function(){
            FB.getLoginStatus(function(response){
                // response.status
            });

        }
    );

    function handleFacebookLogging() {
        if(is3rdPartyCookieEnabled) 
        {
            auth.signInWithRedirect(new facebookAuthProvider());
        } 
        else 
        {
            requestEnableCookies('Facebook')
        }
    }

    function requestEnableCookies(authProvider) {
        /*
            Display warning message to guide user to enable cookies in their browser settings

            User-side Steps involved:

            Method 1 (Global settings):
                GoTo: chrome://settings/cookies
                Select 'Allow all cookies'

            Method 2 (Domain specific settings):
                GoTo: chrome://settings/cookies
                LookFor: 'Sites that can always use cookies' in 'Customized behaviors' section
                ClickOn: 'Add' button
                Enter: Your website URL (www.example.com)
        */
        alert('Unable to logIn to your ' + authProvider + ' account. Please enable your browser cookies')
    }

    window.onmessage = (event) => {
        if(event.data !== 'supported')
        {
            // event.data ==> possibly be ==> 'unsupported'
            console.log('Cookies are not supported :(')

            /* 
                You can remove social log-on buttons 
                (needs to be implemented here incase used - as its on detect trigger event)
            
                |or| 
                
                display error message incase user tries signing with any authProvider (apart from integrated signing method)
                (it's already implemented using {requestEnableCookies function} & {is3rdPartyCookieEnabled useState} in this example)
            */

            // Perfoming actions...
            set3rdPartyCookieResult(false)  // is3rdPartyCookieEnabled => state => false
        }
        document.getElementById('3rdpartycookiecheck').remove()
    };

    return (
        <div>

            <div id='3rdpartycookiecheck' dangerouslySetInnerHTML={{ __html: "<iframe src='/3rdpartycookiecheck/cookieValidator.html' style='display: none;' />"}} />

            <button id="google-form" onClick={handleGoogleLogging}>Google</button>

            <div className="fb-login-button" data-size="medium" data-auto-logout-link="true" data-scope={'public_profile,email'}>
                <button id="facebook-form" onClick={handleFacebookLogging}>Facebook</button>
            </div>

            <button id="github-form" onClick={handleGithubLogging}>GitHub</button>
        </div>
    )
}