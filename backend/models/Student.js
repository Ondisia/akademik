module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nis: { type: DataTypes.STRING(20), allowNull: false, unique: 'unique_nis' },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: 'unique_email' },
    password: { type: DataTypes.STRING, allowNull: false },
    class_id: { type: DataTypes.INTEGER, references: { model: 'classes', key: 'id' } },
    parent_id: { type: DataTypes.INTEGER, references: { model: 'parents', key: 'id' } }
  }, { 
    tableName: 'students',
    indexes: [
      { unique: true, fields: ['nis'] },
      { unique: true, fields: ['email'] }
    ]
  });
  
  Student.associate = (models) => {
    Student.belongsTo(models.Class, { foreignKey: 'class_id', constraints: false });
    Student.belongsTo(models.Parent, { foreignKey: 'parent_id', constraints: false });
    Student.hasMany(models.Grade, { foreignKey: 'student_id', constraints: false });
    Student.hasMany(models.Attendance, { foreignKey: 'student_id', constraints: false });
    Student.hasMany(models.Payment, { foreignKey: 'student_id', constraints: false });
    Student.hasMany(models.Message, { 
      foreignKey: 'sender_id',
      constraints: false,
      scope: { sender_type: 'student' }
    });
  };
  return Student;
};