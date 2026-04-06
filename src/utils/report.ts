import Clarity from '@microsoft/clarity'
const projectId = 'w79r4fnls1'
Clarity.init(projectId)

Clarity.event('custom-event')
