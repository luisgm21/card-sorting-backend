import mongoose from 'mongoose';

const participationSchema = new mongoose.Schema({
  studyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Study',
    required: true
  },

  // Puede ser anónimo o usuario registrado
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // Para participación anónima
  anonymousId: {
    type: String,
    unique: true,
    sparse: true
  },

  // Los resultados del card sorting
  sortingResult: {
    // Formato: { cardId: "categoryId", ... }
    assignments: {
      type: Map,
      of: String
    },

    // Categorías creadas por el participante (para open sorting)
    customCategories: [{
      id: String,
      name: String,
      description: String
    }],

    // Tiempo que tardó
    timeSpent: Number, // en segundos

    // Orden en que vio las tarjetas
    cardOrder: [String],

    // Feedback adicional
    comments: String,
    difficulty: {
      type: Number,
      min: 1,
      max: 5
    }
  },

  // Estado de la participación
  status: {
    type: String,
    enum: ['started', 'completed', 'abandoned'],
    default: 'started'
  },

  // Metadatos
  deviceInfo: {
    userAgent: String,
    ip: String,
    browser: String,
    os: String
  },

  startedAt: {
    type: Date,
    default: Date.now
  },

  completedAt: Date,

  // Consentimiento
  consentGiven: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Índices para análisis rápido
participationSchema.index({ studyId: 1, status: 1 });
participationSchema.index({ studyId: 1, completedAt: -1 });
// anonymousId ya tiene índice por unique:true + sparse:true

// Método para completar participación
participationSchema.methods.complete = async function(sortingData) {
  this.sortingResult = sortingData;
  this.status = 'completed';
  this.completedAt = new Date();
  this.sortingResult.timeSpent = (this.completedAt - this.startedAt) / 1000;

  await this.save();

  // Incrementar contador en el estudio
  await mongoose.model('Study').updateOne(
    { _id: this.studyId },
    { $inc: { totalParticipants: 1 } }
  );
};

export default mongoose.model('Participation', participationSchema);