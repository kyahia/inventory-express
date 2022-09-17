function asy1(){
   setTimeout(() => 1, 100);
}
function asy2(){
   setTimeout(() => 2, 100);
}

Promise.all([asy1(), asy2()]).then(res => console.log(res));
