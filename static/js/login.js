const formLogin = document.getElementById('login')

formLogin?.addEventListener('submit', async (event) => {
  event.preventDefault()

  // @ts-ignore
  const formDataEncoded = new URLSearchParams(new FormData(formLogin))

  const response = await fetch('/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    // @ts-ignore
    body: formDataEncoded 
  })

  const res = await fetch('/api/users/current')
    if (res.status !== 200) {
      alert('necesitas loguearte para ver esta info!')
      Swal.fire({
        title: "Fallo de inicio",
        icon: "error",
        color: "write",
        text: "Ingresar usuario y contraseña!"
      });
      return (window.location.href = '/login')
    }

    const result = await res.json()
    const usuario = result.payload
    
    const rol= usuario.rol

    if(rol == "admin"){
      window.location.href = '/addProducts'
    }else if(rol == "premium"){
      window.location.href= '/userPremium'
    }else{
      window.location.href = '/productos'
    }
    
  
});



