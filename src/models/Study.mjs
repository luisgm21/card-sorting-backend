import { Schema, model } from 'mongoose';

const studySchema = new Schema({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: [100, 'El título no puede exceder 100 caracteres']
  },
  
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  
  // Las tarjetas que los participantes deben ordenar
  cards: [{
    id: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    description: String // Información adicional de la tarjeta
  }],
  
  // Categorías predefinidas (opcional - para card sorting cerrado)
  predefinedCategories: [{
    id: String,
    name: String,
    description: String
  }],
  
  // Tipo de card sorting
  type: {
    type: String,
    enum: ['open', 'closed', 'hybrid'],
    default: 'open',
    required: true
  },
  // open: Los participantes crean sus propias categorías
  // closed: Usan categorías predefinidas
  // hybrid: Pueden crear nuevas o usar predefinidas
  
  // Configuración del estudio
  settings: {
    maxCardsPerCategory: {
      type: Number,
      default: null // null = sin límite
    },
    minCardsPerCategory: {
      type: Number,
      default: 0
    },
    allowUncategorized: {
      type: Boolean,
      default: false
    },
    timeLimit: {
      type: Number, // en minutos
      default: null
    },
    shuffleCards: {
      type: Boolean,
      default: true // Mostrar tarjetas en orden aleatorio
    }
  },
  
  // Estado del estudio
  status: {
    type: String,
    enum: ['draft', 'published', 'closed', 'archived'],
    default: 'draft'
  },
  
  // Fechas del estudio
  startDate: Date,
  endDate: Date,
  
  // Quién lo creó
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Participación
  totalParticipants: {
    type: Number,
    default: 0
  },
  
  // Compartir
  shareableLink: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generar link único para compartir
studySchema.pre('save', async function(next) {
  if (!this.shareableLink) {
    this.shareableLink = Math.random().toString(36).substring(2, 15);
  }
  next();
});

// Índices para búsquedas rápidas
studySchema.index({ status: 1, createdBy: 1 });
studySchema.index({ shareableLink: 1 });

export default model('Study', studySchema);