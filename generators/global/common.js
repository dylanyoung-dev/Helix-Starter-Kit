'use strict';

module.exports = {

    ensureSolutionSection(slnText, name, ordering) {
        if(slnText.indexOf(`GlobalSection(${name})` == -1)) {
            let sectionText =
                `	GlobalSection(${name}) = ${ordering}\r\n` +
                `	EndGlobalSection`;

            slnText = slnText.replace(/\r\nGlobal\s*\r\n/, `$&${sectionText}\r\n`);
        }

        return slnText;
    },

    ensureSolutionFolder(slnText, folderName) {
        let folderGuid = this._getSolutionFolderGuid(slnText, folderName);
        
        if (!folderGuid) {
            folderGuid = UUID();
            
            let folderDefinition = 
                `Project("{2150E333-8FDC-42A3-9474-1A3956D46DE8}") = "${folderName}", "${folderName}", "{${folderGuid}}"\r\n` +
                `EndProject`
            
            slnText = slnText.replace(/\r\nMinimumVisualStudioVersion[^\r\n]*\r\n/, `$&${folderDefinition}\r\n`);
        }

        return slnText;
    },

    getSolutionFolderGuid(slnText, folderName) {
        let regex = new RegExp(`Project\\("{2150E333-8FDC-42A3-9474-1A3956D46DE8}"\\) = "[0-9\. ]*${folderName}", "[0-9\. ]*${folderName}", "{(.+)}"`);
        let matches = slnText.match(regex);

        return matches && matches[1];
    },

    modifyAvailableRenderings() {
        let paths =
            glob.sync("**/Presentation/Available Renderings/Page Content.item")
                .map(p => this.destinationPath(p));

        if(!paths || paths.length === 0) {
            console.log(chalk.bold.yellow("An 'available renerings' serialized item was not found."));
            console.log(chalk.bold.yellow("If you want new components to be added to the toolbox automatically, add the following item to one of your TDS projects:"));
            console.log(chalk.bold.blue(`    /sitecore/content/${this.model.tenantFolderName}/Shared/Presentation/Available Renderings/Page Content`));
            console.log();
            return;
        }

        for (let path of paths) {
            let itemText = this.fs.read(path);
            let lines = itemText.split('\r\n');
            
            let changed = false;

            for(let i = 0; i < lines.length; i++) {
                if(lines[i] === 'field: {715AE6C0-71C8-4744-AB4F-65362D20AD65}') {
                    lines[i + 5] += `|{${this.model.renderingItemGuid}}`;
                    lines[i + 3] = lines[i + 3].replace(/[0-9]+/, lines[i + 5].length);
                    
                    changed = true;
                    
                    break;
                }
            }

            if (changed) {
                this.fs.write(path, lines.join('\r\n'));
            }
        }
    },

    getSolutionFilePath() {
        let slnFile =
            fs.readdirSync(this.destinationPath())
                .find(_ => _.endsWith('.sln'));

        return slnFile && path.join(this.destinationPath(), slnFile);
    }
};