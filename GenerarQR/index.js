function generateQR() {
    var qrText = document.getElementById('qrText').value;

    if (qrText.trim() !== '') {
        var qrCodeDiv = document.getElementById('qrCode');
        qrCodeDiv.innerHTML = ''; // Clear previous QR code if any

        var qr = new QRious({
            value: qrText,
            size: 300
        });

        var qrImage = new Image();
        qrImage.src = qr.toDataURL('image/jpeg');

        qrCodeDiv.appendChild(qrImage);
    }
}

function downloadQR(format) {
    var qrText = document.getElementById('qrText').value;
    if (qrText.trim() === '') {
        alert("Por favor, genera un código QR primero.");
        return;
    }

    var qr = new QRious({
        value: qrText,
        size: 300
    });

    if (format === 'jpg') {
        var link = document.createElement('a');
        link.href = qr.toDataURL('image/jpeg');
        link.download = 'qrcode.jpg';
        link.click();
    } else if (format === 'pdf') {
        var doc = new jsPDF();
        doc.addImage(qr.toDataURL('image/jpeg'), 'JPEG', 10, 10, 180, 180);
        doc.save('qrcode.pdf');
    }
}


