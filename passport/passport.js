var LocalStrategy =  require('passport-local').Strategy;
var models  = require('../models');
//var sql = require('mysql2');

module.exports = function(passport){

	passport.serializeUser (function (user, done){
		done(null, user);
	});

	passport.deserializeUser (function (obj, done){
		done(null, obj);
	});

	passport.use(new LocalStrategy({
		passReqToCallback : true
	}, function(req, username, password, done){
		var CodRol =null, CodArea = '';

		models.UTI_Tecnico.findAll({ where: {CodigoTecnico: username , ClaveTecnico: password, ActivoTecnico: 'A'} }).then(tecnicos => {
			//console.log(tecnicos.length);
			if (tecnicos.length>0){
				//console.log('USUARIO: ' + users[0].dataValues.CodigoUsuario);
				models.UTI_Rol.findAll({ where: {IdRol: tecnicos[0].dataValues.IdRol} }).then(roles => {
					if (roles.length>0){
						//console.log(perfiles[0].dataValues.CodigoPerfil);
						CodRol =JSON.parse(JSON.stringify(roles));
						//console.log( CodRol[0] );

						models.UTI_Area.findAll({ where: {IdArea: tecnicos[0].dataValues.IdArea} }).then(areas => {
						    // We don't need spread here, since only the results will be returned for select queries
						    if (areas.length>0){

						    	CodArea =JSON.parse(JSON.stringify(areas));
						    	//console.log( CodArea[0] );
								
								return done(null, {
							 		CodigoTecnico : tecnicos[0].dataValues.CodigoTecnico,
							 		NombresTecnico : tecnicos[0].dataValues.NombreTecnico,
							 		ApellidosTecnico : tecnicos[0].dataValues.ApellidoTecnico,
							 		CodigoRol : CodRol[0],
							 		CodigoArea : CodArea[0]
							 	});

						    }
						}).catch(Error => {
							console.log('Error para el registro: ' + Error);
						});
					}
					else{
						return done(null, false, req.flash('authmessage', 'Tecnico sin rol(es).'));
					}
				}).catch(Error => {
					console.log('Error para el registro: ' + Error);
				});

			}
			else{
				return done(null, false, req.flash('authmessage', 'Tecnico inactivo o contraseña incorrecta.'));
			}

		}).catch(Error => {
			console.log('Error para el registro: ' + Error);
		});

	}
	));

};