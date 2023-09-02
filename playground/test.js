// test.js




class Base {
	constructor() {



		this.test = async function() {
			let res = await request().catch(errorHandler)
		}


		async function request() {
			throw new Error("request failed")
		}



		function errorHandler(err) {
			throw err
		}
	}
}




const base = new Base()


base.test()