from pathlib import Path
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,KeepTogether
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import json

root=Path(__file__).resolve().parents[1]
if Path('C:/Windows/Fonts/arial.ttf').exists():
    pdfmetrics.registerFont(TTFont('Arial','C:/Windows/Fonts/arial.ttf'))
    pdfmetrics.registerFont(TTFont('Arial-Bold','C:/Windows/Fonts/arialbd.ttf'))
else:
    from reportlab.pdfbase.pdfmetrics import Font
    pdfmetrics.registerFont(Font('Arial','Helvetica','WinAnsiEncoding'))
    pdfmetrics.registerFont(Font('Arial-Bold','Helvetica-Bold','WinAnsiEncoding'))
pdfmetrics.registerFontFamily('Arial',normal='Arial',bold='Arial-Bold')
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='NameIris',fontName='Arial-Bold',fontSize=23,leading=27,textColor=colors.HexColor('#102b50'),spaceAfter=8))
styles.add(ParagraphStyle(name='RoleIris',fontName='Arial-Bold',fontSize=11,leading=15,textColor=colors.HexColor('#235caa'),spaceAfter=9))
styles.add(ParagraphStyle(name='BodyIris',fontName='Arial',fontSize=9.2,leading=12.7,textColor=colors.HexColor('#243449'),spaceAfter=6))
styles.add(ParagraphStyle(name='SectionIris',fontName='Arial-Bold',fontSize=10,leading=14,textColor=colors.HexColor('#235caa'),spaceBefore=12,spaceAfter=7))
styles.add(ParagraphStyle(name='SmallIris',fontName='Arial',fontSize=8,leading=11,textColor=colors.HexColor('#4b5e76'),spaceAfter=7))
def P(txt,style='BodyIris'): return Paragraph(txt,styles[style])
profile_raw=(root/'js/profile.js').read_text(encoding='utf-8'); profile=json.loads(profile_raw[profile_raw.index('{'):profile_raw.rindex('}')+1])
def footer(canvas,doc):
    canvas.setStrokeColor(colors.HexColor('#d6dfeb'));canvas.line(42,35,A4[0]-42,35)
    canvas.setFont('Arial',7.5);canvas.setFillColor(colors.HexColor('#4b5e76'))
    canvas.drawString(42,23,'Iris Luján Lazzarini · San Justo, Santa Fe · CV actualizado en octubre de 2026')
    canvas.drawRightString(A4[0]-42,23,str(doc.page))

for mode in ['it','administrativo']:
    it=mode=='it'
    story=[P('Iris Luján Lazzarini','NameIris'),P('Análisis Funcional Junior · Desarrollo de Software · Soporte IT' if it else 'Administración Junior · Excel · Gestión de Datos','RoleIris'),P('San Justo, Santa Fe, Argentina · Oportunidades presenciales, híbridas o remotas<br/>irislazzarini81@gmail.com<br/><link href="https://irislazzarini.github.io/Miport-folio/" color="#235caa">Portafolio: irislazzarini.github.io/Miport-folio/</link> · <link href="https://github.com/IrisLazzarini" color="#235caa">GitHub: IrisLazzarini</link><br/><link href="https://www.linkedin.com/in/iris-lazzarini" color="#235caa">LinkedIn: iris-lazzarini</link>','SmallIris'),P('PERFIL PROFESIONAL','SectionIris')]
    story.append(P('Técnica Superior en Análisis Funcional de Sistemas Informáticos. Experiencia en relevamiento de requerimientos, documentación funcional, consultas SQL, pruebas y soporte a usuarios. Combino desarrollo web con organización y verificación de información. Continúo mi formación en Desarrollo de Software y Soporte e Infraestructura.' if it else 'Técnica Superior en Análisis Funcional de Sistemas Informáticos con experiencia de voluntariado administrativo en digitalización documental, carga en Excel, clasificación y revisión de registros. Me interesa trabajar en administración, Data Entry y gestión de información, aplicando organización y capacidad analítica.'))
    story.append(P('EXPERIENCIA','SectionIris'))
    exp=profile['experiences']
    selected=[(exp[2],'Relevamiento de necesidades, documentación funcional, soporte a usuarios y seguimiento de incidencias. Consultas SQL para verificar información; colaboración en roles y permisos. Herramientas: SQL, MySQL, PHP y Excel.'),(exp[1],'Desarrollo de una plataforma de blog con autenticación, publicaciones y comentarios. APIs, criterios de aceptación y pruebas funcionales con mentoría. Herramientas: React, Vite, Node.js, Express, PostgreSQL, Prisma y Git.'),(exp[3],'Requerimientos con el cliente, validación de navegación, desarrollo de interfaz, pruebas, documentación y soporte. Herramientas: React, Tailwind CSS y Git.'),(exp[0],'Digitalización documental, carga y clasificación de registros en Excel. Revisión de inconsistencias y preparación de planillas para el control administrativo anual.')]
    if not it: selected=[(exp[0],exp[0]['responsibilities']['es']+' Herramientas: Microsoft Excel y documentación física.'),(exp[2],'Documentación de procesos, soporte a usuarios internos, seguimiento de incidencias y consultas SQL para verificar información. Experiencia en una pasantía institucional.'),(exp[3],'Relevamiento con el cliente, organización de información comercial, validación de navegación, documentación de cambios y soporte durante la implementación.')]
    for item,desc in selected:
        org=item['organization']['es'] if isinstance(item['organization'],dict) else item['organization']
        story.append(KeepTogether([P('<b>'+item['role']['es']+'</b>'),P(org+' · '+item['period']['es'],'SmallIris'),P(desc)]))
    story.append(P('HABILIDADES','SectionIris'))
    story.append(P('Análisis funcional · Requerimientos · Documentación · Testing funcional · Soporte a usuarios<br/>SQL / MySQL / PostgreSQL · JavaScript · React · PHP · Python / Flask · HTML / CSS<br/>Git / GitHub · Excel · Jira · Trello · Figma' if it else 'Microsoft Excel · Data Entry · Digitalización y gestión documental · Clasificación de registros · Verificación de datos · Organización de información · Preparación de reportes administrativos<br/>Herramientas complementarias: SQL / MySQL, Git / GitHub y documentación funcional.'))
    story.append(P('FORMACIÓN ACADÉMICA','SectionIris'))
    story.append(P('<b>Técnica Superior en Análisis Funcional de Sistemas Informáticos</b><br/>Escuela Superior de Comercio N.º 45 “Dr. José Roberto González” · 2023-2025 · Egresada<br/><b>Tecnicatura Superior en Desarrollo de Software</b><br/>ISP N.º 20 “Senador Néstor J. Zamaro” · Desde marzo de 2026 · En curso<br/><b>Tecnicatura Superior en Soporte e Infraestructura</b><br/>ISP N.º 20 “Senador Néstor J. Zamaro” · Desde marzo de 2026 · En curso'))
    if it:
        story.append(P('PROYECTOS Y FORMACIÓN COMPLEMENTARIA','SectionIris'))
        story.append(P('Desarrollo web para Hojalatería Chartier y PulverAgro; proyectos institucionales y sistemas de gestión. Casos y tecnologías en el portafolio.<br/>JavaScript / Full Stack - AmplixMe · Full Stack Developer - CILSA · Yo Puedo Programar - Junior Achievement Santa Fe · Inglés niveles I y II - Centro Universitario de Idiomas.'))
    else:
        story.append(P('PROYECTO EN PREPARACIÓN','SectionIris'))
        story.append(P('Integración de información de Excel con Power BI para visualizar y analizar datos administrativos del Fondo Becario. En preparación; no se presenta como experiencia implementada ni como dominio de Power BI.'))
    dest=root/'assets/docs'/f'iris-lazzarini-cv-{mode}.pdf'
    SimpleDocTemplate(str(dest),pagesize=A4,rightMargin=42,leftMargin=42,topMargin=37,bottomMargin=44,title='Iris Luján Lazzarini - CV '+('IT' if it else 'Administrativo'),author='Iris Luján Lazzarini').build(story,onFirstPage=footer,onLaterPages=footer)
    print(dest.name)
