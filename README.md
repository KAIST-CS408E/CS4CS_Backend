# CS4CS_Backend
Server and DB management

to run server,
```
node app.js
```
# How To Test The Server-side?
1. Download Insomnia

https://insomnia.rest/download/#windows

2. Open Insomnia

3. Click the pupple button, and make a new workspace

4. Press Ctrl+N to make a new request. Put a proper url and body(click "body" button and choose "JSON")

4-1. For example, 
```
// url
http://143.248.188.11:8003/users/

// JSON body
{
	"name": "YOUR_NAME",
	"email": "YOUR_EMAIL_STRING",
	"phone_number": "YOUR_PHONE_NUMBER"
}
```

4-2. For more information about url, look up "routes/index.js" code

5. Click "Send" button

5-1. You will see the JSON response as below
```
{
	"message": "User Registered Sucessfully !"
}
```

5-2. You can also receive a confirmation email from your 'YOUR_EMAIL_STRING' account. (Confirmation step is not yet fully developed)
