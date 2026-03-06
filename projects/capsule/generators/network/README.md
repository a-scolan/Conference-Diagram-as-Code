# Network Firewall Matrix Generator for LikeC4

Custom generators for LikeC4 that automatically extract network relationships from architecture models and generate firewall rule matrices in markdown format, with dynamic extraction of network information from deployment models.

## Overview

This generator provides two tools:
- **firewall-matrix**: Generates a network flow matrix showing machine-to-machine relationships with protocol, port, and zone information
- **debug-deployment**: Generates a deployment infrastructure inventory for troubleshooting

## Installation and Configuration

### Files

- `network_matrix_gen.ts` - Custom generator definitions
- `likec4.config.ts` - Project TypeScript configuration (in your project directory)

### Configuration

Import the generators in your project's TypeScript configuration file:

```typescript
// likec4.config.ts (in your project root)
import { defineConfig } from 'likec4/config'
import generators from '../shared/generators/network/network_matrix_gen'

export default defineConfig({
  name: 'your-project',
  title: 'Your Project Title',
  generators
})
```

> **Note**: Adjust the import path based on your workspace structure. If generators are in `projects/shared/generators/network/`, use `'../shared/generators/network/network_matrix_gen'` from your project directory.

## Usage

### Generate Firewall Matrix

```bash
npx likec4 gen firewall-matrix --project your-project
```

Generates `assets/firewall-matrix.md` containing:
- Machine-to-machine network relationships (filtered)
- Automatically extracted protocols and ports
- VLAN, IP address, and hostname information from deployment model
- Virtual machines generated for logical systems without physical deployment
- Table format ready for firewall rule requests

### Generate Deployment Debug Information

```bash
npx likec4 gen debug-deployment --project your-project
```

Generates `assets/debug-deployment.md` with:
- Complete inventory of VMs/servers/infrastructure nodes
- Zone/VLAN structure
- Hostnames, IP addresses, complete descriptions
- Deployment statistics

### Example Output

```markdown
|            |               | **SOURCE** |                 |             | **DESTINATION** |               |             | **FLUX**      |          | **Objet**           |
| ---------- | ------------- | ---------- | --------------- | ----------- | --------------- | ------------- | ----------- | ------------- | -------- | ------------------- |
| **Action** | **Demandeur** | **Zone**   | **Identifiant** | **@IP**     | **Zone**        | **Identifiant**| **@IP**     | **Protocole** | **Port** |                     |
| A          | username      | VLAN 10    | web-prod-01     | 10.0.1.10   | VLAN 20         | api-prod-01   | 10.0.2.10   | HTTPS         | 443      | API requests        |
| A          | username      | VLAN 20    | api-prod-01     | 10.0.2.10   | VLAN 30         | db-prod-01    | 10.0.3.10   | POSTGRES      | 5432     | Database queries    |
```

## Features

### Automatic Extraction

The generator automatically extracts from the LikeC4 deployment model:

- **Zones/VLANs**: Name and number extracted from zone titles (e.g., "DMZ (VLAN 10: 10.0.1.0/24)")
  - Zone column displays: "VLAN 10", "VLAN 20", etc. for easy identification
  - Special zones like "Internet" remain as-is
- **IP Addresses**: Extracted from markdown tables in node descriptions
- **Hostnames**: Extracted from markdown tables `| **Hostname** | value |`
- **Protocols**: Inferred from relationship technologies or relationship types
- **Ports**: Automatically mapped from protocols or explicitly mentioned

### Machine-to-Machine Filtering

The generator intelligently filters relationships to keep only real network flows:

- ✅ **Kept**: Relationships between deployed physical/virtual machines
- ✅ **Kept**: Relationships where at least one endpoint is a real machine
- ❌ **Filtered**: Purely logical relationships (system → system)
- ❌ **Filtered**: Relationships between generated VMs only

### Virtual Machine Generation

For logical systems without physical deployment, the generator automatically creates virtual machines:

```
Logical element: myService
→ Generated machine: myService-vm
   Zone: Zone non définie
   VLAN: TBD (To Be Determined)
   IP: 192.168.101.1
```

This allows creating firewall rules even for systems under design. IP addresses use the 192.168.101.x-200.x range to avoid conflicts with real networks.

### Default Port Mappings

```typescript
const DEFAULT_PORTS = {
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
```

### Firewall Actions

The generator automatically determines the action:

- **I** (Implicit): Existing/external systems (kind contains "Existing" or "External")
- **A** (Add): New internal systems
- Can be manually modified: **S** (Suppress/Remove), **T** (Temporary)

### Requester

Automatically extracted from system environment variables:
- Windows: `process.env.USERNAME`
- Unix/Mac: `process.env.USER`

## Generator Architecture

### Code Structure

```
network_matrix_gen.ts
├── DEFAULT_PORTS              # Protocol→port mappings
├── NetworkInfo interface      # Network information structure
│
├── extractVlan()             # Extract name + VLAN number from zones
├── extractIp()               # Extract IP from descriptions
├── extractIdentifier()       # Extract hostname from markdown tables
├── formatZoneDisplay()       # Format zone display as "VLAN X" or special names
├── getNetworkInfo()          # Traverse hierarchy for complete info
├── getProtocolAndPort()      # Extract from relationships
│
├── debug-deployment          # Infrastructure inventory generator
│   ├── List VMs/Servers/Nodes
│   ├── List Zones/VLANs
│   └── Display complete specs
│
└── firewall-matrix           # Firewall matrix generator
    ├── Build element kinds map
    ├── Build deployment node map
    ├── Extract network locations
    ├── Generate fictional VMs
    ├── Collect & filter relationships
    ├── Determine actions & protocols
    └── Generate sorted markdown table
```

### Data Flow

1. **Access deployment**: `model.$data.deployments.elements` (raw data)
2. **Node mapping**: Build Map for hierarchical navigation
3. **Location extraction**: Traverse deployed instances → network info
4. **VM generation**: Create fictional machines for non-deployed elements
5. **Relationship analysis**: Traverse `model.relationships()`
6. **Filtering**: Remove logical-to-logical relationships
7. **Enrichment**: Add VLANs, IPs, ports, actions for each rule
8. **Sorting**: By source VLAN number (numeric), then source identifier, then destination identifier
9. **Generation**: Produce formatted markdown table with VLAN numbers in Zone columns

### Hierarchical Extraction

The generator traverses the deployment hierarchy to collect information:

```
Instance (myApp.instance)
  └─> VM/Server Node (production.dmz.web-vm)
      ├─> Extract: IP, Hostname
      └─> Parent: Zone Node (production.dmz)
          └─> Extract: VLAN Name, VLAN Number
```

## Customization

### Add Custom Ports

Modify the `DEFAULT_PORTS` dictionary in `network_matrix_gen.ts`:

```typescript
const DEFAULT_PORTS: Record<string, string> = {
  'HTTPS': '443',
  'CUSTOM_PROTOCOL': '8080', // Add here
  // ...
}
```

### Modify Extraction Patterns

The following functions can be customized:

#### `extractVlan(node)`
Extracts VLAN name and number from zone titles.

Current pattern: `"DMZ (VLAN 10: ...)"` → `{ name: "DMZ", number: "10" }`

#### `extractIp(node)`
Extracts IP address from node descriptions.

Supported patterns:
- Simple: `10.0.2.10` in text
- Markdown table: `| **Network** | 10.0.2.10 |`

#### `extractIdentifier(node)`
Extracts hostname from markdown tables.

Pattern: `| **Hostname** | web-prod-01 |`

#### `getProtocolAndPort(relationship)`
Extracts protocol and port from relationships.

Sources:
1. Relationship `technology` property
2. Relationship `kind` property
3. Default: HTTPS:443

### Modify Output Format

The table format can be modified in the markdown generation section of the `firewall-matrix` generator.

Current columns:
- Action, Requester
- Source: Zone, Identifier, @IP
- Destination: Zone, Identifier, @IP
- Flow: Protocol, Port
- Object

### Adjust Filtering

The filtering logic can be modified:

```typescript
// Current filtering criteria
const sourceIsGenerated = sourceInfo.vlanNumber === 'TBD'
const targetIsGenerated = targetInfo.vlanNumber === 'TBD'

if (sourceIsGenerated && targetIsGenerated) {
  // Skip: both are generated (logical system to logical system)
  continue
}
```

To include all relationships (even logical ones), comment out this block.

## Debugging

### Verify Deployment Model

```bash
npx likec4 gen debug-deployment --project your-project
```

Check in `assets/debug-deployment.md`:
- ✅ All VMs are listed with their specs
- ✅ Zones/VLANs are properly structured
- ✅ Hostnames and IPs are extracted
- ✅ Descriptions are complete

### Common Issues

**Issue**: VLAN displayed as "N/A"
- **Cause**: Zone title pattern not recognized
- **Solution**: Verify zones follow format "Name (VLAN X: ...)"

**Issue**: IP displayed as "N/A"
- **Cause**: IP not present in VM/Server node description
- **Solution**: Add IP in description or markdown table

**Issue**: Hostname displayed as element ID
- **Cause**: Markdown table `**Hostname**` missing
- **Solution**: Add table in description: `| **Hostname** | value |`

**Issue**: No rules generated
- **Cause**: No relationships between deployed instances, all filtered
- **Solution**: Verify elements have deployment instances

**Issue**: Too many rules with generated VMs
- **Cause**: Many logical elements without deployment
- **Solution**: Add more deployment instances in the model

## Limitations and Considerations

### Data Extraction

- **Markdown Format**: Extraction relies on patterns in markdown descriptions
- **Conventions**: Requires consistent naming conventions
- **Metadata**: No direct access to structured metadata (LikeC4 API limitations)

### Relationships and Filtering

- A logical relationship generates a single firewall rule
- N-to-N relationships (multiple instances) are not duplicated
- Only direct relationships are considered (no transitivity)

### Virtual Machines

- Use fictional IP addresses in range 192.168.101.x-200.x
- Placed in zone "Zone non définie" with VLAN "TBD" (To Be Determined)
- Must be replaced with real machines and actual network configuration before deployment

## Future Enhancements

### Suggested Improvements

1. **Structured Metadata**
   - Use custom properties instead of markdown parsing
   - Add support for YAML/JSON metadata in descriptions

2. **Multi-Instance Relationships**
   - Duplicate rules for each instance pair
   - Handle N-to-N relationships correctly

3. **Multi-Format Export**
   - CSV for firewall tool import
   - JSON for API integration
   - Excel for manual review

4. **Validation**
   - Verify port/protocol consistency
   - Detect conflicts or redundant rules
   - Alert on missing information

5. **Additional Generators**
   - Network flow diagrams with Mermaid
   - Automatic architecture documentation
   - Exports for Ansible/Terraform

## Usage Examples

### Required Deployment Model

For optimal generator performance, structure your deployment model like this:

```likec4
specification {
  element Node_Vm
  element Node_Server
  element Zone_Dmz
  element Zone_Lan
}

deployment production {
  element lan = Zone_Lan {
    title 'User LAN (VLAN 5: 10.0.0.0/24)'
    description 'End user network'
    
    element staffVm = Node_Vm {
      title 'Staff VM'
      description '''
        | Property | Value |
        |----------|-------|
        | **Hostname** | staff-prod-01 |
        | **Network** | 10.0.0.10 |
        | **OS** | Ubuntu 22.04 LTS |
      '''
    }
  }
  
  element dmz = Zone_Dmz {
    title 'DMZ (VLAN 10: 10.0.1.0/24)'
    
    element webVm = Node_Server {
      title 'Web Server'
      description '''
        | **Hostname** | web-prod-01 |
        | **Network** | 10.0.1.10 |
      '''
    }
  }
}

// Then deploy logical elements
deployment production {
  lan.staffVm = instance of staff
  dmz.webVm = instance of webServer
}
```

### Test with a New Project

1. Create a new LikeC4 project
2. Copy `network_matrix_gen.ts` to a generators folder
3. Configure `likec4.config.ts` to import generators
4. Create a deployment model with zones and VMs
5. Add relationships between logical elements
6. Run `npx likec4 gen firewall-matrix`

## Resources

- [LikeC4 Documentation](https://likec4.dev)
- [Custom Generators Guide](https://likec4.dev/tooling/code-generation/custom/)
- [Model API Reference](https://likec4.dev/tooling/model-api)
- [Deployment Model Guide](https://likec4.dev/docs/dsl/deployment/)

## Support

For questions or improvements:
- [LikeC4 GitHub](https://github.com/likec4/likec4)
- [LikeC4 Discord](https://discord.gg/likec4)

## License

Ce générateur est fourni comme exemple d'utilisation de l'API de générateurs personnalisés LikeC4.
