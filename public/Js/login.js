const login = document.getElementById('login');
login.addEventListener('submit',e=>{
	e.preventDefault();

	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;

	fetch('/loginPost',{
    method:'POST',
    headers:{
    	"Content-Type":"application/json"
    },
    body:JSON.stringify({email,password})
	})
	.then(res=>res.json())
	.then(res=>{
		if(res.status){
			Swal.fire(`¡Bienvenido al Sistema ${res.role}!`);
			setTimeout(()=>{
			if(res.role !== "admin"){
				window.location.href='/bienvenidos';
			}else{
			    window.location.href='/dashboar';	
			}
            
			},1000);
		}else if(!res.status){
         Swal.fire('Correo o contraseña incorrectos , vuelve a intentar');
		}else{
		Swal.fire(`Error en el servidor : ${res.error}`);
		}
	})
});