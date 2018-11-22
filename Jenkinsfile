pipeline {
  agent any
  stages {
    stage('Step1') {
      steps {
        sh 'ls -all'
      }
    }
    stage('Step2') {
      steps {
        echo 'Hello'
      }
    }
    stage('Step3') {
      steps {
        sh 'echo "hi"'
      }
    }
  }
}