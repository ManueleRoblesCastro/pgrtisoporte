//var sql = require('mysql2');
var models  = require('../models');
var dateFormat = require('dateformat');
var fs = require('fs');
var vunderscore = require('underscore');

module.exports = {
	
	getDatosTableroxTec : function (req, res, next){
		//console.log(req.user);
		var varmenuselect = null;
		var datostableroxtec = null;
		var detalletableroxtec = null;
		var menusel = req.params.menu;
		var codigotecnicoin = req.user.CodigoTecnico.trim();	
			
		models.sequelize.query(`SELECT UTI_Otrabajo.CodigoTecnico, UTI_Tecnico.NombreTecnico + ' ' + UTI_Tecnico.ApellidoTecnico AS NombreTecnico, COUNT(*) AS ConteoOT, SUM(UTI_Otrabajo.Peso) AS SumaPesoOT, 10 AS idEstado 
			FROM UTI_Otrabajo INNER JOIN UTI_Tecnico ON UTI_Otrabajo.CodigoTecnico = UTI_Tecnico.CodigoTecnico  
			GROUP BY UTI_Otrabajo.CodigoTecnico, UTI_Tecnico.NombreTecnico + ' ' + UTI_Tecnico.ApellidoTecnico`, 
			{ type: models.sequelize.QueryTypes.SELECT}).then(datostabxcantpeso =>{
				datostableroxtec = JSON.parse(JSON.stringify(datostabxcantpeso));
				//console.log(datosmenusxtec);
				
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
                         UTI_FIJ_ActivosFijos ON UTI_Otrabajo.CodigoActivoFijo = UTI_FIJ_ActivosFijos.CodigoActivoFijo`, 
						{ type: models.sequelize.QueryTypes.SELECT}).then(detallextablero =>{
							
							detalletableroxtec = JSON.parse(JSON.stringify(detallextablero));
							fs.writeFile('../../wwwroot/upload/tableroxest_10.json', JSON.stringify(detalletableroxtec), function (err) {
								if (err) throw err;
								console.log('tableroxTec Saved!');
							});
						
							//console.log(varmeenusuperior);
							res.render('pantallas/tableroxtecnico', {
								isAuthenticated : req.isAuthenticated(),
								user : req.user,
								datostableroxtec : datostableroxtec,
								menuactual: { menu : menusel, datamenuselect : varmenuselect[0]
								}
							});
							
				}).catch(Error => {
					console.log('Error para el registro: ' + Error);
				});							
					
			}).catch(Error => {
				console.log('Error para el registro: ' + Error);
			});				
		}).catch(Error => {
			console.log('Error para el registro: ' + Error);
		});				
		
	},
	
	getDatosTableroxEst : function (req, res, next){
		//console.log(req.user);
		var datostableroxtec = null;
		var detalletableroxtec = null;
		var estadosel = req.params.estado;
		var strgroupot='', strdetalleot='';
		
		if (estadosel != 10){
			strgroupot =`SELECT UTI_Otrabajo.CodigoTecnico, UTI_Tecnico.NombreTecnico + ' ' + UTI_Tecnico.ApellidoTecnico AS NombreTecnico, COUNT(*) AS ConteoOT, SUM(UTI_Otrabajo.Peso) AS SumaPesoOT, ${estadosel} AS idEstado 
			FROM UTI_Otrabajo INNER JOIN UTI_Tecnico ON UTI_Otrabajo.CodigoTecnico = UTI_Tecnico.CodigoTecnico
			WHERE (UTI_Otrabajo.IdEstado = ${estadosel})  
			GROUP BY UTI_Otrabajo.CodigoTecnico, UTI_Tecnico.NombreTecnico + ' ' + UTI_Tecnico.ApellidoTecnico`;
			
			strdetalleot=`SELECT UTI_Otrabajo.IdOT, CONVERT(varchar(10), UTI_Otrabajo.FechaOT, 103) AS FechaOT, UTI_Otrabajo.Resumen, UTI_Otrabajo.Peso, UTI_Unidad.NombreUnidad, CONVERT(varchar(10), UTI_Otrabajo.FechaResolucion, 103) AS FechaResolucion,  
             UTI_FIJ_ActivosFijos.NombreActivoFijo, UTI_Dispositivo.nombre AS Dispositivo, UTI_Prioridad.NombrePrioridad, UTI_Otrabajo.IdEstado, UTI_Otrabajo.CodigoTecnico 
			 FROM UTI_Otrabajo INNER JOIN
             UTI_Prioridad ON UTI_Otrabajo.IdPrioridad = UTI_Prioridad.IdPrioridad LEFT OUTER JOIN
             UTI_Dispositivo ON UTI_Otrabajo.codigo_dispositivo = UTI_Dispositivo.codigo_dispositivo LEFT OUTER JOIN
             UTI_LugarSolicitud ON UTI_Otrabajo.IdLugar = UTI_LugarSolicitud.IdLugar LEFT OUTER JOIN
             UTI_Unidad ON UTI_Otrabajo.IdUnidad = UTI_Unidad.IdUnidad LEFT OUTER JOIN
             UTI_FIJ_ActivosFijos ON UTI_Otrabajo.CodigoActivoFijo = UTI_FIJ_ActivosFijos.CodigoActivoFijo WHERE (UTI_Otrabajo.IdEstado = ${estadosel})`;			
		}else{			
			strgroupot =`SELECT UTI_Otrabajo.CodigoTecnico, UTI_Tecnico.NombreTecnico + ' ' + UTI_Tecnico.ApellidoTecnico AS NombreTecnico, COUNT(*) AS ConteoOT, SUM(UTI_Otrabajo.Peso) AS SumaPesoOT, 10 AS idEstado 
			FROM UTI_Otrabajo INNER JOIN UTI_Tecnico ON UTI_Otrabajo.CodigoTecnico = UTI_Tecnico.CodigoTecnico  
			GROUP BY UTI_Otrabajo.CodigoTecnico, UTI_Tecnico.NombreTecnico + ' ' + UTI_Tecnico.ApellidoTecnico`;
			
			strdetalleot=`SELECT UTI_Otrabajo.IdOT, CONVERT(varchar(10), UTI_Otrabajo.FechaOT, 103) AS FechaOT, UTI_Otrabajo.Resumen, UTI_Otrabajo.Peso, UTI_Unidad.NombreUnidad, CONVERT(varchar(10), UTI_Otrabajo.FechaResolucion, 103) AS FechaResolucion,  
             UTI_FIJ_ActivosFijos.NombreActivoFijo, UTI_Dispositivo.nombre AS Dispositivo, UTI_Prioridad.NombrePrioridad, UTI_Otrabajo.IdEstado, UTI_Otrabajo.CodigoTecnico 
			 FROM UTI_Otrabajo INNER JOIN
             UTI_Prioridad ON UTI_Otrabajo.IdPrioridad = UTI_Prioridad.IdPrioridad LEFT OUTER JOIN
             UTI_Dispositivo ON UTI_Otrabajo.codigo_dispositivo = UTI_Dispositivo.codigo_dispositivo LEFT OUTER JOIN
             UTI_LugarSolicitud ON UTI_Otrabajo.IdLugar = UTI_LugarSolicitud.IdLugar LEFT OUTER JOIN
             UTI_Unidad ON UTI_Otrabajo.IdUnidad = UTI_Unidad.IdUnidad LEFT OUTER JOIN
             UTI_FIJ_ActivosFijos ON UTI_Otrabajo.CodigoActivoFijo = UTI_FIJ_ActivosFijos.CodigoActivoFijo`;			
		}
			
		models.sequelize.query(strgroupot, 
			{ type: models.sequelize.QueryTypes.SELECT}).then(datostabxcantpeso =>{
				datostableroxtec = JSON.parse(JSON.stringify(datostabxcantpeso));
				//console.log(datosmenusxtec);
										
			models.sequelize.query(strdetalleot, 
				{ type: models.sequelize.QueryTypes.SELECT}).then(detallextablero =>{
					
					detalletableroxtec = JSON.parse(JSON.stringify(detallextablero));
					fs.writeFile('../../wwwroot/upload/tableroxest_'+estadosel+'.json', JSON.stringify(detalletableroxtec), function (err) {
						if (err) throw err;
						console.log('tableroxEst Saved!');
					});
				
					res.json({
							isAuthenticated : req.isAuthenticated(), 
							datostableroxtec : datostableroxtec
					});					
			}).catch(Error => {
				console.log('Error para el registro: ' + Error);
			});				
		}).catch(Error => {
			console.log('Error para el registro: ' + Error);
		});				
		
	},
	
	getOTsxestado :  function (req, res, next){
		var codigoestadoi = req.params.codigoestado;
		var codigotecnicoi = req.params.codigotecnico;
		var datootfiltered = null;
		var respuesta = {res: false};

		var otsxestados = fs.readFileSync('../../wwwroot/upload/tableroxest_'+codigoestadoi+'.json');
		var jsonotxestados = JSON.parse(otsxestados);
		if (codigoestadoi==10){
			datootfiltered = vunderscore.where(jsonotxestados, {CodigoTecnico: codigotecnicoi});
		}
		else{
			datootfiltered = vunderscore.where(jsonotxestados, {IdEstado: parseInt(codigoestadoi), CodigoTecnico: codigotecnicoi});
		}

		if(datootfiltered!=undefined){
			respuesta.res=true
			res.json( 
				{
					datootfiltered : datootfiltered,
					respuesta : respuesta
				}
			);
		}
		else{
			res.json(respuesta);
		}
	},
	
	getOts : function (req, res, next){
		//console.log(req.user);
		var opcion = req.params.opcion;
		var CodIdOT= req.params.IdOT;

		var empleadoslist = null, unidadeslist = null, lugareslist = null,
		activofijoslist = null,	prioridadeslist = null, estadoslist = null,
		tiposlist = null, subtiposlist = null, categoriaslist = null,
		tecnicoslist = null, OTupdate = null;
		var fechaactual = new Date();
		var fechaYMD = dateFormat(fechaactual, 'yyyy/mm/dd');			

		models.UTI_HUM_Empleadosdepurados.findAll({attributes: ['IdMarca',
			[ models.sequelize.fn('CONCAT', 
				models.UTI_HUM_Empleadosdepurados.sequelize.col('NombresEmpleado'), ' ' , 
				models.UTI_HUM_Empleadosdepurados.sequelize.col('ApellidosEmpleado')), 
				'NombreEmpleado' 
			] 
		]}).then(allempleados =>{
			empleadoslist = JSON.parse(JSON.stringify(allempleados));

			models.UTI_Unidad.findAll({attributes: ['IdUnidad','NombreUnidad']}).then(allunidades =>{
				unidadeslist = JSON.parse(JSON.stringify(allunidades));
				
				models.UTI_LugarSolicitud.findAll({attributes: ['IdLugar','NombreLugar']}).then(alllugares =>{
					lugareslist = JSON.parse(JSON.stringify(alllugares));
					
					models.UTI_FIJ_ActivosFijos.findAll({attributes: ['CodigoActivoFijo',
						[ models.sequelize.fn('CONCAT', 
							models.UTI_HUM_Empleadosdepurados.sequelize.col('CodigoActivoFijo'), '**' , 
							models.UTI_HUM_Empleadosdepurados.sequelize.col('NombreActivoFijo')), 
							'NombreActivoFijo' 
						]						
					]}).then(allactivosfij =>{
						activofijoslist = JSON.parse(JSON.stringify(allactivosfij));
						
						models.UTI_Prioridad.findAll({attributes: ['IdPrioridad','NombrePrioridad']}).then(allprioridad =>{
							prioridadeslist = JSON.parse(JSON.stringify(allprioridad));

							models.UTI_Estados.findAll({attributes: ['IdEstado','NombreEstado']}).then(allestados =>{
								estadoslist = JSON.parse(JSON.stringify(allestados));
								
								models.UTI_Tipo_OT.findAll({attributes: ['IdTipo_OT','NombreTipoOT']}).then(alltipos =>{
									tiposlist = JSON.parse(JSON.stringify(alltipos));
									
									models.UTI_SubTipo_OT.findAll({attributes: ['IdSubTipo_OT','IdTipo_OT',
										[ models.sequelize.fn('CONCAT', 
											models.UTI_HUM_Empleadosdepurados.sequelize.col('Descripcion'), ', Peso:' , 
											models.UTI_HUM_Empleadosdepurados.sequelize.col('Peso')), 
											'Descripcion' 
										],'Peso']}).then(allsubtipos =>{
										subtiposlist = JSON.parse(JSON.stringify(allsubtipos));
										
										models.UTI_Categoria_OT.findAll({attributes: ['IdCategoria_OT','IdSubTipo_OT',	
											[ models.sequelize.fn('CONCAT', 
												models.UTI_HUM_Empleadosdepurados.sequelize.col('Descripcion'), ', Peso:' , 
												models.UTI_HUM_Empleadosdepurados.sequelize.col('Peso')), 
												'Descripcion' 
											],'Peso']}).then(allcategorias =>{
											categoriaslist = JSON.parse(JSON.stringify(allcategorias));

											models.sequelize.query(`SELECT UTI_Otrabajo.CodigoTecnico, UTI_Tecnico.NombreTecnico + ' ' + UTI_Tecnico.ApellidoTecnico + ', Peso: ' + convert(varchar(20), sum( UTI_Otrabajo.Peso)) AS NombreTecnico
												FROM UTI_Otrabajo INNER JOIN UTI_Tecnico ON UTI_Otrabajo.CodigoTecnico = UTI_Tecnico.CodigoTecnico
												WHERE UTI_Tecnico.ActivoTecnico='A'
												GROUP BY  UTI_Otrabajo.CodigoTecnico, UTI_Tecnico.NombreTecnico + ' ' + UTI_Tecnico.ApellidoTecnico
												UNION 
												SELECT UTI_Tecnico.CodigoTecnico, 
												UTI_Tecnico.NombreTecnico + ' ' + UTI_Tecnico.ApellidoTecnico + ', Peso: 0' AS NombreTecnico
												FROM UTI_Tecnico
												WHERE UTI_Tecnico.CodigoTecnico NOT IN (SELECT DISTINCT CodigoTecnico FROM UTI_Otrabajo) 
												AND UTI_Tecnico.ActivoTecnico='A'
												ORDER BY NombreTecnico`, 
											{ type: models.sequelize.QueryTypes.SELECT}).then(alltecnicos =>{
												tecnicoslist = JSON.parse(JSON.stringify(alltecnicos));
												if (opcion==1){
													res.json({ 
															empleadoslist : empleadoslist, 
															unidadeslist : unidadeslist,
															lugareslist : lugareslist,
															activofijoslist : activofijoslist,
															prioridadeslist : prioridadeslist,
															estadoslist : estadoslist,
															tiposlist : tiposlist,
															subtiposlist : subtiposlist,
															categoriaslist : categoriaslist,
															tecnicoslist : tecnicoslist,
															fechaDefault : fechaYMD
													});
												}
												if (opcion==2){
													models.UTI_Otrabajo.findAll({where: { IdOT: CodIdOT }}).then(allot =>{
													OTupdate = JSON.parse(JSON.stringify(allot));
											
														res.json({ 
																empleadoslist : empleadoslist, 
																unidadeslist : unidadeslist,
																lugareslist : lugareslist,
																activofijoslist : activofijoslist,
																prioridadeslist : prioridadeslist,
																estadoslist : estadoslist,
																tiposlist : tiposlist,
																subtiposlist : subtiposlist,
																categoriaslist : categoriaslist,
																tecnicoslist : tecnicoslist,
																fechaDefault : fechaYMD,
																OTupdate : OTupdate
														});

													}).catch(Error => {
														console.log('Error para el registro: ' + Error);
													});//allot														
													
												}				
											}).catch(Error => {
												console.log('Error para el registro: ' + Error);
											});//alltecnicos
										}).catch(Error => {
											console.log('Error para el registro: ' + Error);
										});//allcategorias										
									}).catch(Error => {
										console.log('Error para el registro: ' + Error);
									});//allsubtipos
								}).catch(Error => {
									console.log('Error para el registro: ' + Error);
								});//alltipos								
							}).catch(Error => {
								console.log('Error para el registro: ' + Error);
							});//allestados							
						}).catch(Error => {
							console.log('Error para el registro: ' + Error);
						});//allprioridad
					}).catch(Error => {
						console.log('Error para el registro: ' + Error);
					});//allactivosfij
				}).catch(Error => {
					console.log('Error para el registro: ' + Error);
				});//alllugares
			}).catch(Error => {
				console.log('Error para el registro: ' + Error);
			});//allunidades
		}).catch(Error => {
			console.log('Error para el registro: ' + Error);
		});//allempleados
	},
	
	postOts : function (req, res, next){
		var opcion = req.params.opcion;
		var CodIdOT = req.params.IdOT;
		var respuesta = {res: false};
		var menerror = null;

		if (opcion==1){
			
			models.UTI_Otrabajo.create(
				{
					FechaOT: req.body.FechaOT,
					IdMarca: req.body.IdMarca,
					IdUnidad: req.body.IdUnidad,
					IdLugar: req.body.IdLugar,
					CodigoActivoFijo: req.body.CodigoActivoFijo,
					Resumen: req.body.Resumen,
					IdPrioridad: req.body.IdPrioridad,
					IdEstado: req.body.IdEstado,
					IdTipo_OT: req.body.IdTipo_OT,
					IdSubTipo_OT: req.body.IdSubTipo_OT,
					IdCategoria_OT: req.body.IdCategoria_OT,
					codigo_dispositivo: req.body.codigo_dispositivo,
					CodigoTecnico: req.body.CodigoTecnico,
					FechaResolEsp: req.body.FechaResolEsp
				}
			).then(datosingresados =>{
				respuesta.res=true;
				res.json({ respuesta: respuesta });
			}).catch(Error => {
				console.log('Error para el registro: ' + Error);
				menerror = JSON.stringify(Error);
				menerror = JSON.parse(menerror);
				res.json({ respuesta: respuesta, menerror : menerror});				
			});

		}
		
		if (opcion==2){
			
			models.UTI_Otrabajo.update(
				{
					FechaOT: req.body.FechaOT,
					IdMarca: req.body.IdMarca,
					IdUnidad: req.body.IdUnidad,
					IdLugar: req.body.IdLugar,
					CodigoActivoFijo: req.body.CodigoActivoFijo,
					Resumen: req.body.Resumen,
					IdPrioridad: req.body.IdPrioridad,
					IdEstado: req.body.IdEstado,
					IdTipo_OT: req.body.IdTipo_OT,
					IdSubTipo_OT: req.body.IdSubTipo_OT,
					IdCategoria_OT: req.body.IdCategoria_OT,
					codigo_dispositivo: req.body.codigo_dispositivo,
					CodigoTecnico: req.body.CodigoTecnico,
					FechaResolEsp: req.body.FechaResolEsp
				}, 
				{ where: { IdOT: CodIdOT } }
			).then(datosingresados =>{
				respuesta.res=true;
				res.json({ respuesta: respuesta });
			}).catch(Error => {
				console.log('Error para el registro: ' + Error);
				menerror = JSON.stringify(Error);
				menerror = JSON.parse(menerror);
				res.json({ respuesta: respuesta, menerror : menerror});				
			});

		}
	}

};