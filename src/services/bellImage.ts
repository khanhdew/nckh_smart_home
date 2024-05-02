import axios from 'axios'

export const getBellCapture = async () => {
	axios
		.get('https://db9a-14-162-241-59.ngrok-free.aapp/')
		.then((res) => {
			// console.log(res.data)
		})
		.catch((err) => {
			// console.log(err)
		})
	// 	.then((blob) => {
	// 		return URL.createObjectURL(blob)
	// 	})
	// fetch('https://via.placeholder.com/600/92c952')
	// 	.then((response) => {
	// 		console.log(response)

	// 		return response.blob()
	// 	})
	// 	.then((blob) => {
	// 		const imageUrl = URL.createObjectURL(blob)
	// 		console.log('PNG data converted to URL:', imageUrl)
	// 		// Use the imageUrl as needed (e.g., display in an <img> tag)
	// 	})
	// 	.catch((error) => {
	// 		console.error('Error fetching PNG data:', error)
	// 	})
}
