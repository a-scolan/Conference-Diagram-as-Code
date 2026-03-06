import { defineGenerators } from 'likec4/config'

/**
 * Firewall Table Generator for LikeC4
 * 
 * Generates a network matrix showing all relationships between deployment instances
 * with protocol, port, and network zone information for firewall rule planning.
 */

// Default port mappings for common protocols
const DEFAULT_PORTS: Record<string, string> = {
  'HTTPS': '443',
  'HTTP': '80',
  'SSH': '22',
  'SMTP': '25',
  'SQL': '1433',
  'MYSQL': '3306',
  'POSTGRES': '5432',
  'REDIS': '6379',
  'AMQP': '5672',
  'LDAP': '389',
  'LDAPS': '636',
  'NFS': '2049',
  'TCP': 'N/A',
}

interface NetworkInfo {
  vlanName: string
  vlanNumber: string
  identifier: string
  ip: string
}

/**
 * Extract VLAN name and number from zone description or title
 * Returns object with both name and number
 */
function extractVlan(node: any): { name: string; number: string } {
  // Combine title and description for matching
  const title = String(node.title || '')
  const description = node.description?.md || node.description?.txt || ''
  const text = `${title} ${description}`
  
  // Try to extract zone name and VLAN number from title like "DMZ (VLAN 10: ...)"
  const titleMatch = title.match(/^([^(]+?)\s*\(?VLAN\s+(\d+)/i)
  if (titleMatch) {
    return {
      name: titleMatch[1].trim(),
      number: titleMatch[2]
    }
  }
  
  // Look for VLAN patterns like "VLAN 20", "VLAN 10:", "(VLAN 5:"
  const vlanMatch = text.match(/VLAN\s+(\d+)/i)
  if (vlanMatch) {
    // Try to extract the zone name before VLAN mention
    const nameMatch = title.match(/^([^(0-9]+)/)
    const name = nameMatch ? nameMatch[1].trim() : 'VLAN'
    return {
      name,
      number: vlanMatch[1]
    }
  }
  
  // Look for zone names that might indicate Internet/DMZ
  if (text.match(/internet/i)) return { name: 'Internet', number: 'INTERNET' }
  if (text.match(/\bDMZ\b/i)) return { name: 'DMZ', number: '10' }
  if (text.match(/user/i)) return { name: 'User LAN', number: '5' }
  
  return { name: 'N/A', number: 'N/A' }
}

/**
 * Extract IP address from node description
 */
function extractIp(node: any): string {
  const text = node.description?.md || node.description?.txt || ''
  
  // Look for IP patterns in description (e.g., "10.0.2.10")
  const ipMatch = text.match(/\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/)
  if (ipMatch) {
    return ipMatch[1]
  }
  
  // Also check in tables within the description
  const networkMatch = text.match(/\*\*Network\*\*[^|]*\|[^|]*\|[^|]*?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/)
  if (networkMatch) {
    return networkMatch[1]
  }
  
  return 'N/A'
}

/**
 * Extract hostname/identifier from node
 * Tries to match the pattern: ([um][a-zP][a-z]{1,8}-[0-9](?:pr|pp|in|fo|re|rc)[1-9](?:(?:\.\w+)+)?)
 */
function extractIdentifier(node: any): string {
  const title = String(node.title || '')
  const description = node.description?.md || node.description?.txt || ''
  const text = `${title} ${description}`
  
  // Look for hostname pattern in markdown tables - must be in format | **Hostname** | value |
  const hostnameMatch = text.match(/\|\s*\*\*Hostname\*\*\s*\|\s*([a-z0-9-]+)\s*\|/i)
  if (hostnameMatch) {
    return hostnameMatch[1]
  }
  
  // Try to match the identifier pattern
  const idMatch = text.match(/\b([um][a-z][a-z]{1,8}-\d(?:pr|pp|in|fo|re|rc)\d(?:(?:\.\w+)+)?)\b/i)
  if (idMatch) {
    return idMatch[1]
  }
  
  // Otherwise, use the node ID or a simplified version
  if (node.id) {
    const parts = node.id.split('.')
    return parts[parts.length - 1] || node.id
  }
  
  return node.title || 'N/A'
}

/**
 * Get network information for a deployment node by traversing up to find zone and VM/Server
 */
function getNetworkInfo(nodeMap: Map<string, any>, node: any): NetworkInfo {
  let vlanName = 'N/A'
  let vlanNumber = 'N/A'
  let ip = 'N/A'
  let identifier = 'N/A'
  
  // Start from the current node and traverse up
  let current = node
  const visited = new Set()
  
  while (current && !visited.has(current.id)) {
    visited.add(current.id)
    
    // Check if this is a VM or Server node - extract IP and identifier from it
    if (current.kind && (current.kind === 'Node_Vm' || current.kind === 'Node_Server')) {
      if (ip === 'N/A') {
        ip = extractIp(current)
      }
      if (identifier === 'N/A' || identifier === current.id) {
        identifier = extractIdentifier(current)
      }
    }
    
    // Check if this is an AppBrowser or other user-facing node - use its title/ID
    if (current.kind && current.kind === 'Node_AppBrowser') {
      if (identifier === 'N/A') {
        identifier = current.title || current.id.split('.').pop() || 'N/A'
      }
    }
    
    // Check if this is a Zone - extract VLAN from it
    if (current.kind && (current.kind.includes('Zone') || current.kind.includes('Vlan') || current.kind === 'Zone_Internet')) {
      if (vlanName === 'N/A') {
        const vlanInfo = extractVlan(current)
        vlanName = vlanInfo.name
        vlanNumber = vlanInfo.number
      }
    }
    
    // Move to parent by removing last part of ID
    const currentId = current.id
    const parts = currentId.split('.')
    if (parts.length > 1) {
      parts.pop()
      const parentId = parts.join('.')
      current = nodeMap.get(parentId)
    } else {
      break
    }
  }
  
  // If identifier was never set or is still the node ID, extract from the original node
  if (identifier === 'N/A' || identifier.includes('.')) {
    identifier = extractIdentifier(node)
  }
  
  return { vlanName, vlanNumber, identifier, ip }
}

/**
 * Format zone display using VLAN number and name
 * Returns a concise zone identifier for the firewall matrix
 */
function formatZoneDisplay(vlanName: string, vlanNumber: string): string {
  // Special cases: Internet, unknown zones
  if (vlanNumber === 'INTERNET' || vlanName === 'Internet') {
    return 'Internet'
  }
  if (vlanNumber === 'TBD' || vlanNumber === 'N/A') {
    return 'Zone non définie'
  }
  
  // For standard VLANs, show "VLAN X" format
  return `VLAN ${vlanNumber}`
}

/**
 * Extract protocol and port from relationship
 */
function getProtocolAndPort(relationship: any): { protocol: string, port: string } {
  const tech = relationship.technology || ''
  const kind = relationship.kind || ''
  
  // Try to extract protocol from technology field first
  let protocol = tech.toUpperCase()
  
  // If no technology or it's a generic kind like CALLS/USES, try to infer from relationship kind
  if (!protocol || protocol === 'CALLS' || protocol === 'USES') {
    // Map relationship kinds to protocols
    const kindProtocol = kind.toUpperCase()
    if (kindProtocol === 'HTTP' || kindProtocol === 'HTTPS' || kindProtocol === 'SSH' || 
        kindProtocol === 'SMTP' || kindProtocol === 'SQL' || kindProtocol === 'TCP' ||
        kindProtocol === 'REDIS' || kindProtocol === 'AMQP' || kindProtocol === 'LDAP' ||
        kindProtocol === 'NFS') {
      protocol = kindProtocol
    } else if (kindProtocol === 'CALLS' || kindProtocol === 'USES' || kindProtocol === 'READS' || kindProtocol === 'WRITES' || kindProtocol === 'ASYNC') {
      // Generic relationship kinds - default to HTTPS
      protocol = 'HTTPS'
    } else {
      protocol = 'HTTPS' // Default fallback
    }
  }
  
  // Try to extract port from title or description if explicitly mentioned
  const text = `${relationship.title || ''} ${relationship.description?.text || ''}`
  const portMatch = text.match(/port\s+(\d+)/i)
  if (portMatch) {
    return { protocol, port: portMatch[1] }
  }
  
  // Use default port mapping
  const port = DEFAULT_PORTS[protocol] || 'N/A'
  
  return { protocol, port }
}

export default defineGenerators({
  'debug-deployment': async ({ likec4model, ctx }: any) => {
    const model = likec4model
    let debug = '# Debug Deployment Infrastructure\n\n'
    
    // Access the raw deployment data
    const deploymentData = model.$data?.deployments?.elements || {}
    
    // Build a map for quick lookups
    const deploymentNodeMap = new Map<string, any>()
    for (const [nodeId, nodeData] of Object.entries(deploymentData)) {
      deploymentNodeMap.set(nodeId, nodeData)
    }
    
    debug += '## VMs and Physical Machines\n\n'
    let count = 0
    for (const [nodeId, nodeData] of Object.entries(deploymentData)) {
      const node = nodeData as any
      
      // Only show VM/Server/AppBrowser nodes
      if (node.kind && (node.kind === 'Node_Vm' || node.kind === 'Node_Server' || node.kind === 'Node_AppBrowser')) {
        count++
        debug += `### ${count}. ${node.title || nodeId}\n`
        debug += `- Node ID: ${nodeId}\n`
        debug += `- Kind: ${node.kind}\n`
        
        // Get zone/VLAN information
        const parts = nodeId.split('.')
        let zoneNode: any = null
        let tempParts = [...parts]
        while (tempParts.length > 1) {
          tempParts.pop()
          const parentId = tempParts.join('.')
          const parentNode = deploymentNodeMap.get(parentId)
          if (parentNode && parentNode.kind && (parentNode.kind.includes('Zone') || parentNode.kind.includes('Vlan'))) {
            zoneNode = parentNode
            break
          }
        }
        
        if (zoneNode) {
          const vlanInfo = extractVlan(zoneNode)
          debug += `- Zone/VLAN deployed in: ${vlanInfo.name} (VLAN ${vlanInfo.number})\n`
        }
        
        if (node.description) {
          const desc = node.description.md || node.description.txt || ''
          
          // Extract hostname
          const hostnameMatch = desc.match(/\|\s*\*\*Hostname\*\*\s*\|\s*([a-z0-9-]+)\s*\|/i)
          if (hostnameMatch) {
            debug += `- Hostname: **${hostnameMatch[1]}**\n`
          }
          
          // Extract IP
          const ipMatch = desc.match(/\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/)
          if (ipMatch) {
            debug += `- IP Address: **${ipMatch[1]}**\n`
          }
          
          // Show full description
          const lines = desc.split('\n').filter((l: any) => l.trim())
          if (lines.length > 0) {
            debug += `- Description: ${lines[0].substring(0, 300)}\n`
          }
        }
        debug += '\n'
      }
    }
    
    debug += `\n## Zones/VLANs\n\n`
    let zoneCount = 0
    for (const [nodeId, nodeData] of Object.entries(deploymentData)) {
      const node = nodeData as any
      
      // Only show Zone nodes
      if (node.kind && (node.kind.includes('Zone') || node.kind.includes('Vlan'))) {
        zoneCount++
        const vlanInfo = extractVlan(node)
        debug += `### ${zoneCount}. ${vlanInfo.name}\n`
        debug += `- Node ID: ${nodeId}\n`
        debug += `- Kind: ${node.kind}\n`
        debug += `- VLAN Number: ${vlanInfo.number}\n`
        
        if (node.description) {
          const desc = node.description.md || node.description.txt || ''
          const lines = desc.split('\n').filter((l: any) => l.trim())
          if (lines.length > 0) {
            debug += `- Description: ${lines[0].substring(0, 300)}\n`
          }
        }
        debug += '\n'
      }
    }
    
    debug += `\n## Summary\n`
    debug += `- Total VMs/Servers/Nodes: ${count}\n`
    debug += `- Total Zones/VLANs: ${zoneCount}\n`
    
    await ctx.write({
      path: '../../assets/debug-deployment.md',
      content: debug
    })
  },
  
  'firewall-matrix': async ({ likec4model, ctx }: any) => {
    const model = likec4model
    
    // Get system username for demandeur field
    const systemUser = (globalThis as any).process?.env?.USERNAME || 
                      (globalThis as any).process?.env?.USER || 
                      'UserName'
    
    // Build a map of element kinds to determine if they are existing systems
    const elementKinds = new Map<string, string>()
    for (const element of model.elements()) {
      elementKinds.set(element.id, element.kind)
    }
    
    // Access the raw deployment data which contains the element mappings
    const deploymentData = model.$data?.deployments?.elements || {}
    
    // Build a map for quick lookups
    const deploymentNodeMap = new Map<string, any>()
    for (const [nodeId, nodeData] of Object.entries(deploymentData)) {
      deploymentNodeMap.set(nodeId, nodeData)
    }
    
    // Automatically extract network locations from deployment model
    // by traversing the hierarchy to find VLAN, IP, and hostname info
    const networkLocations: Record<string, { vlanName: string, vlanNumber: string, ip: string, identifier: string }> = {}
    
    for (const [nodeId, nodeData] of Object.entries(deploymentData)) {
      const node = nodeData as any
      
      // Only process nodes that are deployments of logical elements
      if (node.element) {
        const elementId = node.element
        
        // Get network info by traversing up the hierarchy
        const networkInfo = getNetworkInfo(deploymentNodeMap, { ...node, id: nodeId })
        
        networkLocations[elementId] = networkInfo
      }
    }
    
    // Generate virtual machines for elements without deployment locations
    const elementsWithoutMachines: Record<string, boolean> = {}
    for (const element of model.elements()) {
      if (!networkLocations[element.id]) {
        // Check if any parent has a location
        const parts = element.id.split('.')
        let foundParent = false
        while (parts.length > 0) {
          parts.pop()
          const parentId = parts.join('.')
          if (networkLocations[parentId]) {
            foundParent = true
            break
          }
        }
        
        // Check if any child has a location (e.g., lemonldap not deployed but lemonldap.reverseProxy is)
        let foundChild = false
        const elementPrefix = element.id + '.'
        for (const deployedId of Object.keys(networkLocations)) {
          if (deployedId.startsWith(elementPrefix)) {
            // Use the first deployed child's location for the parent
            networkLocations[element.id] = networkLocations[deployedId]
            foundChild = true
            break
          }
        }
        
        if (!foundParent && !foundChild) {
          elementsWithoutMachines[element.id] = true
        }
      }
    }
    
    // Create fictional machines for elements without deployments using a unique counter
    let vmCounter = 1
    for (const elementId of Object.keys(elementsWithoutMachines)) {
      networkLocations[elementId] = {
        vlanName: 'Zone non définie',  // Generic zone for machines without deployment
        vlanNumber: 'TBD',              // To Be Determined
        identifier: `${elementId.replace(/\./g, '-')}-vm`,
        ip: `192.168.${100 + vmCounter}.${vmCounter}`  // Plage distincte pour les VMs fictives
      }
      vmCounter++
    }
    
    // Collect all relationships - only machine-to-machine
    const firewallRules: any[] = []
    
    for (const relationship of model.relationships()) {
      const sourceElementId = relationship.source.id
      const targetElementId = relationship.target.id
      
      // Get network location for source (try full ID, then check parent elements)
      let sourceInfo = networkLocations[sourceElementId]
      if (!sourceInfo) {
        // Try parent elements (e.g., 'myApp' if 'myApp.serviceA' not found)
        const parts = sourceElementId.split('.')
        while (parts.length > 0 && !sourceInfo) {
          const parentId = parts.join('.')
          sourceInfo = networkLocations[parentId]
          parts.pop()
        }
      }
      if (!sourceInfo) {
        // Generate a fictional machine on the fly
        sourceInfo = {
          vlanName: 'Zone non définie',
          vlanNumber: 'TBD',
          identifier: `${sourceElementId.replace(/\./g, '-')}-vm`,
          ip: `192.168.${100 + vmCounter}.${vmCounter}`
        }
        vmCounter++
      }
      
      // Get network location for target (try full ID, then check parent elements)
      let targetInfo = networkLocations[targetElementId]
      if (!targetInfo) {
        // Try parent elements (e.g., 'myService' if 'myService.apiHandler' not found)
        const parts = targetElementId.split('.')
        while (parts.length > 0 && !targetInfo) {
          const parentId = parts.join('.')
          targetInfo = networkLocations[parentId]
          parts.pop()
        }
      }
      if (!targetInfo) {
        // Generate a fictional machine on the fly
        targetInfo = {
          vlanName: 'Zone non définie',
          vlanNumber: 'TBD',
          identifier: `${targetElementId.replace(/\./g, '-')}-vm`,
          ip: `192.168.${100 + vmCounter}.${vmCounter}`
        }
        vmCounter++
      }
      
      // Skip rules where source or target is a generated VM (logical systems without real deployments)
      // Only include rules that connect real deployment infrastructure
      const sourceIsGenerated = sourceInfo.vlanNumber === 'TBD'
      const targetIsGenerated = targetInfo.vlanNumber === 'TBD'
      
      if (sourceIsGenerated && targetIsGenerated) {
        // Skip: both are generated (logical system to logical system)
        continue
      }
      
      // Skip rules where source and destination are the same machine (loopback/internal traffic)
      if (sourceInfo.identifier === targetInfo.identifier && sourceInfo.ip === targetInfo.ip) {
        // Skip: same VM to itself (e.g., web-prod-01 → web-prod-01)
        continue
      }
      
      const { protocol, port } = getProtocolAndPort(relationship)
      
      // Determine action: A if at least one system is new, I only if both are existing/external
      const sourceKind = elementKinds.get(sourceElementId) || ''
      const targetKind = elementKinds.get(targetElementId) || ''
      const sourceIsExisting = sourceKind.includes('Existing') || sourceKind.includes('External')
      const targetIsExisting = targetKind.includes('Existing') || targetKind.includes('External')
      // Action "A" (Add) if at least one system is new
      // Action "I" (Implicit) only if both are existing/external systems
      const action = (sourceIsExisting && targetIsExisting) ? 'I' : 'A'
      
      firewallRules.push({
        action,
        demandeur: systemUser,
        source: sourceInfo,
        destination: targetInfo,
        protocol,
        port,
        objet: relationship.title || `${relationship.source.title} → ${relationship.target.title}`
      })
    }
    
    // Sort rules by source VLAN number, then source identifier, then destination identifier
    firewallRules.sort((a, b) => {
      const vlanNumA = a.source.vlanNumber
      const vlanNumB = b.source.vlanNumber
      
      // Handle special cases for sorting
      const getVlanSortKey = (vlanNum: string): number => {
        if (vlanNum === 'INTERNET') return -1  // Internet comes first
        if (vlanNum === 'N/A' || vlanNum === 'TBD') return 999  // Unknown zones last
        return parseInt(vlanNum, 10) || 500  // Normal VLANs sorted numerically
      }
      
      const sortKeyA = getVlanSortKey(vlanNumA)
      const sortKeyB = getVlanSortKey(vlanNumB)
      
      if (sortKeyA !== sortKeyB) {
        return sortKeyA - sortKeyB
      }
      const srcIdA = a.source.identifier
      const srcIdB = b.source.identifier
      if (srcIdA !== srcIdB) {
        return srcIdA.localeCompare(srcIdB)
      }
      return a.destination.identifier.localeCompare(b.destination.identifier)
    })
    
    // Deduplicate rules with same source/destination/protocol/port
    // Keep first occurrence and optionally merge descriptions
    const uniqueRules: typeof firewallRules = []
    const ruleKeys = new Set<string>()
    
    for (const rule of firewallRules) {
      const key = `${rule.source.identifier}|${rule.source.ip}|${rule.destination.identifier}|${rule.destination.ip}|${rule.protocol}|${rule.port}`
      if (!ruleKeys.has(key)) {
        ruleKeys.add(key)
        uniqueRules.push(rule)
      }
      // Note: Duplicate rules are silently dropped (likely C1/C2 relationship pairs pointing to same deployment)
    }
    
    // Generate markdown table
    let markdown = '# Matrice de Flux Réseau - Règles Firewall\n\n'
    const now = new Date()
    markdown += `Généré automatiquement le ${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR')}\n\n`
    
    markdown += '|            |               | **SOURCE** |                 |             | **DESTINATION** |                 |             | **FLUX**      |          | **Objet**                  |\n'
    markdown += '| ---------- | ------------- | ---------- | --------------- | ----------- | --------------- | --------------- | ----------- | ------------- | -------- | -------------------------- |\n'
    markdown += '| **Action** | **Demandeur** | **Zone**   | **Identifiant** | **@IP**     | **Zone**        | **Identifiant** | **@IP**     | **Protocole** | **Port** |                            |\n'
    
    for (const rule of uniqueRules) {
      const action = rule.action
      const demandeur = rule.demandeur
      const srcZone = formatZoneDisplay(rule.source.vlanName, rule.source.vlanNumber)
      const srcId = rule.source.identifier
      const srcIp = rule.source.ip
      const dstZone = formatZoneDisplay(rule.destination.vlanName, rule.destination.vlanNumber)
      const dstId = rule.destination.identifier
      const dstIp = rule.destination.ip
      const protocol = rule.protocol
      const port = rule.port
      const objet = rule.objet
      
      markdown += `| ${action} | ${demandeur} | ${srcZone} | ${srcId} | ${srcIp} | ${dstZone} | ${dstId} | ${dstIp} | ${protocol} | ${port} | ${objet} |\n`
    }
    
    markdown += '\n## Légende des Actions\n\n'
    markdown += '| Actions | |\n'
    markdown += '| ------- | --- |\n'
    markdown += '| **A**jout | |\n'
    markdown += '| **S**uppression | |\n'
    markdown += '| **I**mplicite (flux entre systèmes déjà existants ou gérés par des règles firewall générales ou implicites) | |\n'
    markdown += '| **T**emporaire | |\n'
    
    await ctx.write({
      path: '../../assets/firewall-matrix.md',
      content: markdown
    })
    
    console.log(`✓ Firewall matrix generated with ${uniqueRules.length} rules`)
  }
})
