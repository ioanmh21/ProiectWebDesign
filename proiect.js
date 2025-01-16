const b1=document.getElementById('b1');
const b2=document.getElementById('b2');
const b4=document.getElementById('b4');
const b5=document.getElementById('b5');
const butoane=[b1,b2,b4,b5];

let hideTimeout;
function showButtons() {
    clearTimeout(hideTimeout);

    b2.classList.remove('hidden');
    b4.classList.remove('hidden');
    b5.classList.remove('hidden');
}
function startHideDelay() {
    hideTimeout = setTimeout(() => {
        b2.classList.add('hidden');
        b4.classList.add('hidden');
        b5.classList.add('hidden');
    }, 1100);
}

butoane.forEach(index => {
    index.addEventListener('mouseenter', function() {
        index.style.transform = 'scale(1.07)';
        index.style.transition = 'transform 0.3s ease';
        index.style.backgroundColor = '#4CAF50';
    });
    index.addEventListener('mouseleave', function() {
        index.style.transform = 'scale(1)';
        index.style.backgroundColor = 'lightgreen';
    });
});

b1.addEventListener('mouseenter', showButtons);
b1.addEventListener('mouseleave', startHideDelay);

b2.addEventListener('mouseenter', showButtons);
b2.addEventListener('mouseleave', startHideDelay);

b4.addEventListener('mouseenter', showButtons);
b4.addEventListener('mouseleave', startHideDelay);

b5.addEventListener('mouseenter', showButtons);
b5.addEventListener('mouseleave', startHideDelay);