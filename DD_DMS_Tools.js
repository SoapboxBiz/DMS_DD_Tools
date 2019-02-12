const DD_DMS_Tools = function() {
	const library = {

		DMS_CONTROL : true ,
		SET_PRECISION : true ,
		SECOND_PRECISION : 4,   //  >= 0 ,  zero represents whole number seconds. 

		DDtoDMS : function (DD){
			// DD - flaat ( 0.0 <= DD <  360.0 )
			// return array of 3 floats
			var M = 60*(DD%1) ;
			var S = 60*(M%1)  ;
			var per = Math.pow( 10.0,library.SECOND_PRECISION) ;
			var T = per*(S%1) ;
			var err =  (T%1)  ;
			var d = Math.floor(DD) ;
			var m = Math.floor(M) ;
			var s = Math.floor(S) ;
			var t = T ;
			if(library.SET_PRECISION){
				t = Math.floor(T) ;
				if(err>=0.5)
					t += 1 ;
					s += t*Math.pow( 0.1 ,library.SECOND_PRECISION) ;
				if(s>=60){
					s = 0 ;
					m += 1 ;
				}
				if(m>=60){
					m = 0 ;
					d += 1 ;
				}
			}
			return [ d, m , s ] ;
		} ,

		DMStoDD : function DMStoDD(dms){
			// dms - array float [ 0.0 <= d < 360.0  ,  0.0 <= m < 60.0  ,  0.0 <= s < 60.0 ]
			//         with d and m being whole numbers.
			// return float
			var d = dms[0] ;
			var m = dms[1] ;
			var s = dms[2] ;
			var DD = d + (m/60.0) + (s/3600.0) ;
			return DD ;
		} ,

		//..................................................
		//.. the following are to reduce the precision for floats
		//.. and construct string representations.

		processDDfloat : function (DDfloat){
			//.. DDfloat - float representing a decimal degree number.
			//   return - object { float, string } with a specific precision set by boolean arguments. 

			var decimalPrecision = library.DMS_CONTROL ? 4 : 3 ;  
			var decPrecision = decimalPrecision ;
			var DDsubString = DDfloat.toString() ;
			if(library.SET_PRECISION){
				decPrecision += library.SECOND_PRECISION ;
				DDsubString = DDfloat.toFixed(decPrecision) ;
			}
			return { floatVal: parseFloat(DDsubString) , stringVal: DDsubString } ;
		} ,

		process_dmsArrayFloat : function (dmsArrayFloat){
			//.. dmsArrayFloat - array float [ 0.0 <= d < 360.0  ,  0.0 <= m < 60.0  ,  0.0 <= s < 60.0 ]
			//   return - object {float_array, string_array} with a specific precision set by boolean arguments. 

			var dmsSubString = dmsArrayFloat[2].toString() ;
			if(library.SET_PRECISION){
				dmsSubString = dmsArrayFloat[2].toFixed(library.SECOND_PRECISION) ;
			}
			var d = dmsArrayFloat[0].toString() ;
			var m = dmsArrayFloat[1].toString() ;
			return { floatVal: [dmsArrayFloat[0],dmsArrayFloat[1], parseFloat(dmsSubString)] , stringVal: [d,m,dmsSubString] } ;
		} ,

		//..................................................
		//.. the following are to input strings, construct reduced precision floats
		//.. and construct string representations of the reduced precision floats.

		DDtoDMSstrings : function(DDstring){
			var DDfloat = parseFloat(DDstring) ;
			var DDfloat_Values = library.processDDfloat(DDfloat) ;
			var dmsArrayFloat = library.DDtoDMS(DDfloat_Values.floatVal ) ;
			var dmsArrayFloat_Values = library.process_dmsArrayFloat(dmsArrayFloat) ;
			// ......
			d = dmsArrayFloat_Values.stringVal[0] ;
			m = dmsArrayFloat_Values.stringVal[1] ;
			s = dmsArrayFloat_Values.stringVal[2] ;
			//.. adjust input string to value used for calculation
			DD = DDfloat_Values.stringVal ;
			return { DD : DD, d: d , m: m, s: s } ;
		} ,
		DMStoDDstrings : function(dmsStringArray){
			var x = parseFloat(dmsStringArray[0]) ;
			var y = parseFloat(dmsStringArray[1]) ;
			var z = parseFloat(dmsStringArray[2]) ;
			// ......
			dmsArrayFloat_Values = library.process_dmsArrayFloat([x, y, z ]) ;
			var DDfloat = library.DMStoDD(dmsArrayFloat_Values.floatVal) ;
			DDfloat_Values = library.processDDfloat(DDfloat) ;
			// ......
			DD = DDfloat_Values.stringVal ;
			//.. adjust input strings to values used for calculation
			d = dmsArrayFloat_Values.stringVal[0] ;
			m = dmsArrayFloat_Values.stringVal[1] ;
			s = dmsArrayFloat_Values.stringVal[2] ;	
			return { DD : DD, d: d , m: m, s: s } ;	
		}

//==================================================
   } ;
  return library ;
}() ;