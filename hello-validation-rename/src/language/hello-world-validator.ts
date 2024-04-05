import { AstUtils, UriUtils, type ValidationAcceptor, type ValidationChecks } from 'langium';
import type { HelloWorldAstType, Person } from './generated/ast.js';
import type { HelloWorldServices } from './hello-world-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: HelloWorldServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.HelloWorldValidator;
    const checks: ValidationChecks<HelloWorldAstType> = {
        Person: validator.checkNamingConvention
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class HelloWorldValidator {

    checkNamingConvention(person: Person, accept: ValidationAcceptor): void {
        if (person.name) {
            const u = AstUtils.getDocument(person).uri;
            const expected = UriUtils.dirname(u).toString()+"/" + person.name +".hello"
            const actual = u.toString();
            if (expected !== actual) {
                accept('warning', 'Naming convention broken.', { node: person, property: 'name', code: "xxxx",
            data: { expectedFileName: expected} });
            }
        }
    }

}
