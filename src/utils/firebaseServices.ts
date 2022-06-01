import { storageImage } from '../firebase/firebase'
import { ref, deleteObject } from '@firebase/storage'

export const deleteImage = (url:string) => {
    return new Promise((resolve) => {
        const imageRef = ref(storageImage, url)
        deleteObject(imageRef)
            .then(() => {resolve(imageRef)})
            .catch((err: any) => {console.error(err.message)})
    })
}

export const deleteManyImages = (arr:Array<string>) => {
    return Promise.all(arr.map(a => deleteImage(a)))
}