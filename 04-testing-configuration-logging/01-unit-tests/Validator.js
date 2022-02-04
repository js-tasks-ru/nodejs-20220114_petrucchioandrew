module.exports = class Validator {
  constructor(rules) {
    const requiredFieldRules = ['type', 'min', 'max'];

    for (const field of Object.keys(rules)) {
      requiredFieldRules.forEach(fieldRule => {
        if (rules[field][fieldRule] === undefined) {
          throw new Error(`Missed rule '${fieldRule}' in '${field}' field`);
        }
      });
    }

    this.rules = rules;
  }

  validate(obj) {
    let errors = [];

    for (const field of Object.keys(this.rules)) {
      const rules = this.rules[field];

      const value = obj[field];
      const type = typeof value;

      if (type !== rules.type) {
        errors = [{field, error: `expect ${rules.type}, got ${type}`}];
        return errors;
      }

      switch (type) {
        case 'string':
          if (value.length < rules.min) {
            errors.push({field, error: `too short, expect ${rules.min}, got ${value.length}`});
          }
          if (value.length > rules.max) {
            errors.push({field, error: `too long, expect ${rules.max}, got ${value.length}`});
          }
          break;
        case 'number':
          if (value < rules.min) {
            errors.push({field, error: `too little, expect ${rules.min}, got ${value}`});
          }
          if (value > rules.max) {
            errors.push({field, error: `too big, expect ${rules.max}, got ${value}`});
          }
          break;
      }
    }

    return errors;
  }
};
