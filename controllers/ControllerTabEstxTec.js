var models  = require('../models');
var dateFormat = require('dateformat');

module.exports = {
	
	getOTsxesttec : function (req, res, next){
		//console.log(req.user);
		var varmenuselect = null;
		var datostableroxtecest = null;
		var menusel = req.params.menu.trim();
		var estadoid = 0;
		var codigotecnicoin = req.user.CodigoTecnico.trim();
		
		if (menusel=='UTIMEOT01'){ estadoid =1;	}
		if (menusel=='UTIMEOT02'){ estadoid =3;	}
		if (menusel=='UTIMEOT03'){ estadoid =4;	}
		if (menusel=='UTIMEOT04'){ estadoid =5;	}
		if (menusel=='UTIMEOT05'){ estadoid =6;	}	
						
		models.sequelize.query(`SELECT TOP(1) NombreMenu, AyudaMenu, CodigoMenuSuperior, ColorSemantic, IconoSemantic
			FROM UTI_SIS_MenusOperacion WHERE CodigoMenu='${menusel}'`, 
			{ type: models.sequelize.QueryTypes.SELECT}).then(datomenuselect =>{
			varmenuselect = JSON.parse(JSON.stringify(datomenuselect));
				
			models.sequelize.query(`SELECT UTI_Otrabajo.IdOT, CONVERT(varchar(10), UTI_Otrabajo.FechaOT, 103) AS FechaOT, UTI_Otrabajo.Resumen, UTI_Otrabajo.Peso, UTI_Unidad.NombreUnidad, CONVERT(varchar(10), UTI_Otrabajo.FechaResolucion, 103) AS FechaResolucion,  
                 UTI_FIJ_ActivosFijos.NombreActivoFijo, UTI_Dispositivo.nombre AS Dispositivo, UTI_Prioridad.NombrePrioridad, UTI_Otrabajo.IdEstado, UTI_Otrabajo.CodigoTecnico 
				 FROM UTI_Otrabajo INNER JOIN
                 UTI_Prioridad ON UTI_Otrabajo.IdPrioridad = UTI_Prioridad.IdPrioridad LEFT OUTER JOIN
                 UTI_Dispositivo ON UTI_Otrabajo.codigo_dispositivo = UTI_Dispositivo.codigo_dispositivo LEFT OUTER JOIN
                 UTI_LugarSolicitud ON UTI_Otrabajo.IdLugar = UTI_LugarSolicitud.IdLugar LEFT OUTER JOIN
                 UTI_Unidad ON UTI_Otrabajo.IdUnidad = UTI_Unidad.IdUnidad LEFT OUTER JOIN
                 UTI_FIJ_ActivosFijos ON UTI_Otrabajo.CodigoActivoFijo = UTI_FIJ_ActivosFijos.CodigoActivoFijo
				 WHERE UTI_Otrabajo.CodigoTecnico = '${codigotecnicoin}' AND UTI_Otrabajo.IdEstado = ${estadoid}`, 
				{ type: models.sequelize.QueryTypes.SELECT}).then(detallextablero =>{				
					//console.log(varmeenusuperior);
					datostableroxtecest = JSON.parse(JSON.stringify(detallextablero));
					
					res.render('pantallas/tableroxestado', {
						isAuthenticated : req.isAuthenticated(),
						user : req.user,
						datostableroxtecest : datostableroxtecest,
						menuactual: { menu : menusel, datamenuselect : varmenuselect[0]
						}
					});
						
			}).catch(Error => {
				console.log('Error para el registro: ' + Error);
			});							
				
		}).catch(Error => {
			console.log('Error para el registro: ' + Error);
		});				
		
	}

};