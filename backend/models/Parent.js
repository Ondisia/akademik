module.exports = (sequelize, DataTypes) => {
  const Parent = sequelize.define('Parent', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING(15), allowNull: false },
    email: { type: DataTypes.STRING, unique: 'unique_email' },
    password: { type: DataTypes.STRING, allowNull: false }
  }, { 
    tableName: 'parents',
    indexes: [
      { unique: true, fields: ['email'] }
    ]
  });

  Parent.associate = (models) => {
    // Orang tua memiliki banyak siswa (anak)
    Parent.hasMany(models.Student, { foreignKey: 'parent_id', constraints: false });
    // Orang tua memiliki banyak pembayaran (Pembayaran)
    Parent.hasMany(models.Payment, { foreignKey: 'parent_id', constraints: false });
    // Polymorphic: Parent bisa menjadi pengirim/penerima pesan
    Parent.hasMany(models.Message, {
      foreignKey: 'sender_id',
      constraints: false,
      scope: { sender_type: 'parent' }
    });
    Parent.hasMany(models.Message, {
      foreignKey: 'receiver_id',
      constraints: false,
      scope: { receiver_type: 'parent' }
    });
  };
  return Parent;
};