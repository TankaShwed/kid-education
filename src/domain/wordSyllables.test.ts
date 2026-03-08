import { describe, it, expect } from 'vitest';
import { splitWordIntoParts } from './wordSyllables';

describe('splitWordIntoParts', () => {
  it('should split МАМА into МА, МА', () => {
    expect(splitWordIntoParts('МАМА')).toEqual(['МА', 'МА']);
  });

  it('should split СТОЛ into С, ТО, Л', () => {
    expect(splitWordIntoParts('СТОЛ')).toEqual(['С', 'ТО', 'Л']);
  });

  it('should split СОК into СО, К', () => {
    expect(splitWordIntoParts('СОК')).toEqual(['СО', 'К']);
  });

  it('should split СЛОН into С, ЛО, Н', () => {
    expect(splitWordIntoParts('СЛОН')).toEqual(['С', 'ЛО', 'Н']);
  });
});
