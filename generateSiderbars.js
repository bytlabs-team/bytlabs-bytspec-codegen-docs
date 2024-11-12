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

async function generateResolversSideBar() {
    const files = await getFilesByRegex("./docs/api", /.*SchemaResolver.mdx/);
    return {
        "type": "category",
        "label": "Resolvers",
        "items": [
            {
                "type": "category",
                "label": "Schema",
                "items": await Promise.all(files.map(async resolverName => {
                    const resolverNameFlushed = resolverName
                        .replace("SchemaResolver", "")
                        .replace(".mdx", "");
                    const templateContexts = (await getFilesByRegex("./docs/api", new RegExp(`${resolverNameFlushed}TemplateContext[a-zA-Z]*.mdx`))) || [];
                    const items = [
                        `api/${resolverName.replace(".mdx", "")}`,

                    ]

                    if (templateContexts.some(_ => true)) {
                        items.push({
                            type: "category",
                            label: "Contexts",
                            items: templateContexts.map(fileName => `api/${fileName.replace(".mdx", "")}`)
                        });
                    }

                    return {
                        "type": "category",
                        "label": resolverNameFlushed,
                        "items": items
                    }
                }))
            }
        ]
    }
}

async function generateSideBarPreset() {
    const resolvers = await generateResolversSideBar();
    console.log(resolvers)
    return ({
        docSiderbar: [resolvers]
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
