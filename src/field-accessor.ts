const fieldsSymbol = Symbol.for('fields')
const keySymbol = Symbol.for('key')
export const fieldAccessor = () =>
    new Proxy<{ getFields: (target?: object) => string[]; [fieldsSymbol]: any; [keySymbol]: string }>(
        {
            [fieldsSymbol]: {},
            [keySymbol]: '',
            getFields: (target) => {
                const resultFields: string[] = []
                for (const fieldName in target[fieldsSymbol]) {
                    if (Object.prototype.hasOwnProperty.call(target[fieldsSymbol], fieldName)) {
                        const field = target[fieldsSymbol][fieldName]
                        const fields = field
                            .getFields()
                            .map((f) => (target[keySymbol] ? `${target[keySymbol]}.${f}` : f))
                        if (fields.length) {
                            resultFields.push(...fields)
                        } else {
                            resultFields.push(fieldName)
                        }
                    }
                }

                return resultFields
            },
        },
        {
            get(target, key: string | symbol) {
                if (key === 'getFields') {
                    return () => target.getFields(target)
                }

                if (!target[fieldsSymbol][key]) {
                    target[fieldsSymbol][key] = fieldAccessor()
                }

                return target[fieldsSymbol][key]
            },
        }
    )
