module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nip: { type: DataTypes.STRING(20), unique: 'unique_nip', allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: 'unique_email', allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING(15) },
    address: { type: DataTypes.TEXT }
  }, { 
    tableName: 'teachers',
    indexes: [
      { unique: true, fields: ['nip'] },
      { unique: true, fields: ['email'] }
    ]
  });

  Teacher.associate = (models) => {
    // Relasi many-to-many dengan Subject melalui TeacherSubject
    Teacher.belongsToMany(models.Subject, {
      through: models.TeacherSubject,
      foreignKey: 'teacher_id',
      otherKey: 'subject_id',
      constraints: false
    });
    // Guru memiliki banyak jadwal (Schedule)
    Teacher.hasMany(models.Schedule, { foreignKey: 'teacher_id', constraints: false });
    // Guru dapat membuat banyak pengumuman
    Teacher.hasMany(models.Announcement, { foreignKey: 'created_by', constraints: false });
    // Polymorphic: Guru bisa menjadi pengirim/penerima pesan
    Teacher.hasMany(models.Message, {
      foreignKey: 'sender_id',
      constraints: false,
      scope: { sender_type: 'teacher' }
    });
    Teacher.hasMany(models.Message, {
      foreignKey: 'receiver_id',
      constraints: false,
      scope: { receiver_type: 'teacher' }
    });
  };
  return Teacher;
};