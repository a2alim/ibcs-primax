private getAllTrainersInstitutesList() {
        this._authService.getAllUser().toPromise().then(
            result => {
                result.forEach(ti => {
                    // if (ti.userType === 'Rms_Training_Institute') {
                    this.trainingInstitutes.push(ti);
                    // }
                })

                this.getList();
                this.spinner = false
            },
            error => {
                console.log(error)
            }
        )
    }