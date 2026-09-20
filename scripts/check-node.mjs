const [major, minor] = process.versions.node.split(".").map(Number)
const supported = major > 22 || (major === 22 && minor >= 13)

if (!supported) {
  console.error("\nORDENA+ necesita Node.js 22.13 o una versión más reciente.")
  console.error("Instala la versión LTS actual desde https://nodejs.org y vuelve a ejecutar el comando.\n")
  process.exit(1)
}
