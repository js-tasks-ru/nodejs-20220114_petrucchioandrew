const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('should skip correct object', () => {
      const validator = new Validator({
        name: {type: 'string', min: 3, max: 10},
        age: {type: 'number', min: 18, max: 50},
      });
      const errors = validator.validate({name: 'John', age: 21});

      expect(errors).to.have.length(0);
    });

    it('should detect missed type/min/max rules', () => {
      let validatorError = null;
      const fieldRules = ['type', 'min', 'max'];
      const basicField = {
        name: {type: 'string', min: 0, max: 10},
      };

      fieldRules.forEach(rule => {
        try {
          const fieldWithMissedRule = {...basicField};
          delete fieldWithMissedRule.name[rule];
          new Validator(fieldWithMissedRule);
        } catch (err) {
          validatorError = err;
        } finally {
          expect(validatorError).to.have.property('message');
          expect(
              /Missed rule/.test(validatorError.message),
              `Wrong message for rule: '${rule}'`,
          ).to.be.true;
        }
      });
    });

    describe('incorrect types detection', () => {
      it('checks string type', () => {
        const validator = new Validator({
          name: {type: 'string', min: 0, max: 10},
        });
        const errors = validator.validate({name: 123});

        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
      });

      it('checks number type', () => {
        const validator = new Validator({
          age: {type: 'number', min: 0, max: 10},
        });
        const errors = validator.validate({age: 'old'});

        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
      });

      it('should contain only 1 error when detect an incorrect type', () => {
        const validator = new Validator({
          name: {type: 'string', min: 3, max: 7},
          age: {type: 'number', min: 3, max: 7},
        });
        const errorsOneFieldMulty = validator.validate({name: 12, age: 5});
        const errorsMultyTypes = validator.validate({name: 123, age: 'old'});
        const errorsIncorrectTypeFirst = validator.validate({name: 123, age: 10});
        const errorsIncorrectTypeSecond = validator.validate({name: 'xx', age: 'old'});

        expect(errorsOneFieldMulty).to.have.length(1);
        expect(errorsMultyTypes).to.have.length(1);
        expect(errorsIncorrectTypeFirst).to.have.length(1);
        expect(errorsIncorrectTypeSecond).to.have.length(1);
      });
    });

    describe('validates string fields', () => {
      it('validates min/max length', () => {
        const testChar = 'x';
        const rules = {
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
        };
        const validator = new Validator(rules);

        const errorsToShort = validator.validate({
          name: Array(rules.name.min - 1).fill(testChar).join(''),
        });
        const errorsMinEdge = validator.validate({
          name: Array(rules.name.min).fill(testChar).join(''),
        });
        const errorsMaxEdge = validator.validate({
          name: Array(rules.name.max).fill(testChar).join(''),
        });
        const errorsToLong = validator.validate({
          name: Array(rules.name.max + 1).fill(testChar).join(''),
        });

        expect(errorsToShort).to.have.length(1);
        expect(errorsMinEdge).to.have.length(0);
        expect(errorsMaxEdge).to.have.length(0);
        expect(errorsToLong).to.have.length(1);

        expect(errorsToShort[0]).to.have.property('field').and.to.be.equal('name');
        expect(errorsToShort[0])
            .to.have.property('error')
            .and.to.be.equal(`too short, expect ${rules.name.min}, got ${rules.name.min - 1}`);

        expect(errorsToLong[0]).to.have.property('field').and.to.be.equal('name');
        expect(errorsToLong[0])
            .to.have.property('error')
            .and.to.be.equal(`too long, expect ${rules.name.max}, got ${rules.name.max + 1}`);
      });
    });

    describe('validates number fields', () => {
      it('validates min/max', () => {
        const rules = {
          age: {
            type: 'number',
            min: 10,
            max: 20,
          },
        };
        const validator = new Validator(rules);

        const errorsLess = validator.validate({age: rules.age.min - 1});
        const errorsMinEdge = validator.validate({age: rules.age.min});
        const errorsMaxEdge = validator.validate({age: rules.age.max});
        const errorsGreater = validator.validate({age: rules.age.max + 1});

        expect(errorsLess).to.have.length(1);
        expect(errorsMinEdge).to.have.length(0);
        expect(errorsMaxEdge).to.have.length(0);
        expect(errorsGreater).to.have.length(1);

        expect(errorsLess[0]).to.have.property('field').and.to.be.equal('age');
        expect(errorsLess[0])
            .to.have.property('error')
            .and.to.be.equal(`too little, expect ${rules.age.min}, got ${rules.age.min - 1}`);

        expect(errorsGreater[0]).to.have.property('field').and.to.be.equal('age');
        expect(errorsGreater[0])
            .to.have.property('error')
            .and.to.be.equal(`too big, expect ${rules.age.max}, got ${rules.age.max + 1}`);
      });
    });
  });
});
