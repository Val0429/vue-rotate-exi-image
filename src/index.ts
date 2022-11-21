import LoadImage from 'blueimp-load-image';

export async function generateEXIFrontImage(file: string | File): Promise<string> {
    let imgBase64: string;
    let imgFile: File = null;
    let options: any = {
        canvas: true
    };

    imgFile = checkBase64(file);

    return new Promise((resolve, reject) => {
        LoadImage.parseMetaData(imgFile, (data) => {
            if (data.exif) {
                options.orientation = data.exif.get('Orientation');
            }
            LoadImage(
                imgFile,
                (canvas) => {
                    if (canvas.type === "error") return reject(canvas);
                    imgBase64 = canvas.toDataURL(imgFile.type);
                    resolve(imgBase64);
                },
                options
            );
        });
    });
}

function checkBase64(file) {
    if (typeof (file) === "string") {
        let type = file.split(':')[1].split(';')[0];
        return base64ToBlob(file, type)
    } else {
        return file;
    }
}

function base64ToBlob(base64, fileType) {
    const bin = atob(base64.replace(/^.*,/, ''));
    const buffer = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
    }
    return new Blob([buffer.buffer], {
        type: fileType ? fileType : 'image/*'
    });
}
