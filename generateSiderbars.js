const fs = require('fs/promises')

// Function to get files matching a regex pattern in a directory
/**
 * Description placeholder
 *
 * @async
 * @param {string} directoryPath
 * @param {RegExp} regexPattern
 * @returns {string[]}
 */
async function getFilesByRegex(directoryPath, regexPattern) {
    try {
        const files = await fs.readdir(directoryPath);
        const matchedFiles = files.filter((file) => regexPattern.test(file));
        return matchedFiles;
    } catch (error) {
        console.error('Error reading directory:', error);
        throw error;
    }
}

async function generateSchemaResolversSideBar() {
    const schemaResolvers = await getFilesByRegex("./docs/api", /.*SchemaResolver.mdx/);

    return {
        "type": "category",
        "label": "Schema Resolvers",
        "items": await Promise.all(schemaResolvers.map(async resolverName => {
            return `api/${resolverName.replace(".mdx", "")}`


        }))
    }
}

async function generateTemplateContextsSideBar() {
    const schemaResolvers = await getFilesByRegex("./docs/api", /.*TemplateContext.*.mdx/);

    return {
        "type": "category",
        "label": "Template Contexts",
        "items": await Promise.all(schemaResolvers.map(async resolverName => {          
            return `api/${resolverName.replace(".mdx", "")}`
        }))
    }
}

async function generateExecutionArgsSideBar() {
    const schemaResolvers = await getFilesByRegex("./docs/api", /.*ExecutionArgs.*.mdx/);

    return {
        "type": "category",
        "label": "Execution Args",
        "items": await Promise.all(schemaResolvers.map(async resolverName => {
            return `api/${resolverName.replace(".mdx", "")}`
        }))
    }
}

async function generateSchemaObjectsSideBar() {
    const schemas = await getFilesByRegex("./docs/api", /.*Schema.mdx/);
    return ({
        "type": "category",
        "label": "Schema Objects",
        "items": await Promise.all(schemas.map(async resolverName => `api/${resolverName.replace(".mdx", "")}`))
    })
}

async function generateSideBarPreset() {
    const resolvers = await generateSchemaResolversSideBar();
    const schemaObjects = await generateSchemaObjectsSideBar();
    const templateContexts = await generateTemplateContextsSideBar();
    const executionArgs = await generateExecutionArgsSideBar();
    console.log(resolvers)
    return ({
        apiSiderbar: [schemaObjects, resolvers, executionArgs, templateContexts],
        docSiderbar: [
            "getting-started/intro"
        ]
    })
}

function saveJsonToFile(data, filename) {
    return fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf8');
}

async function main() {
    const data = await generateSideBarPreset();
    await saveJsonToFile(data, "sidebars.json")
}

main()
    .then(() => console.log("Operation completed."))
    .catch(err => console.error(err))
