
export function handleLogin(event: CustomEvent) {
  const { url, username, password } = event.detail;
  console.log('URL:', url);
  console.log('Username:', username);
  console.log('Password:', password);

  const data = {
    username: username,
    url: url,
    password: password
  };
    
  fetch('/api/credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      console.log('Response dats:', data);
    })
    .catch((error) => {
      console.error('Response error:', error);
    });
}
  
export default handleLogin;
