const xhr = new XMLHttpRequest();

function navigate() {
    xhr.open('GET', '/server', true)
    xhr.onload = () => {

    }
    xhr.send('1')
}