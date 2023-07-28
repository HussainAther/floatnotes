import './main.css';
import { noteCreatorComponent, optimizeThreejsWorldMatrixUpdates } from './note-creator';

AFRAME.registerComponent('note-creator', noteCreatorComponent)
optimizeThreejsWorldMatrixUpdates()

